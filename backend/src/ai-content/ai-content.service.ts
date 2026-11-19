import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Not, Repository } from 'typeorm';

import { BadRequestException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';

import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import {
  buildDesignPrompt,
  buildImagePrompt,
  buildStoryPrompt,
  buildThemePrompt,
  clip,
  defaultThemeForSeason,
  getSeason,
  parseJsonObject,
  parseMonths,
  sanitizeTheme,
  toTitleAndBody,
} from './ai-prompts';
import { AiTextService } from './ai-text.service';
import { Publication, PublicationKind, PublicationStatus } from './entities/publication.entity';
import { SiteTheme, ThemeStatus } from './entities/site-theme.entity';

@Injectable()
export class AiContentService {
  private readonly logger = new Logger(AiContentService.name);

  constructor(
    @InjectRepository(Publication) private readonly publications: Repository<Publication>,
    @InjectRepository(SiteTheme) private readonly themes: Repository<SiteTheme>,
    private readonly ai: AiTextService,
    private readonly projects: ProjectService,
    private readonly users: UserService,
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {}

  // ---------- settings ----------

  /** AI_AUTO_PUBLISH=true publishes AI content without waiting for approval. Off by default. */
  get autoPublish(): boolean {
    return this.config.get<string>('AI_AUTO_PUBLISH')?.trim() === 'true';
  }

  status() {
    return {
      enabled: this.ai.isEnabled,
      provider: this.ai.provider,
      imageEnabled: this.ai.imageEnabled,
      autoPublish: this.autoPublish,
      season: this.currentSeason(),
    };
  }

  currentSeason() {
    return getSeason(new Date(), parseMonths(this.config.get<string>('DRY_SEASON_MONTHS')));
  }

  private requireAi() {
    if (!this.ai.isEnabled) {
      throw new ServiceUnavailableException(
        'AI is not configured. Add ANTHROPIC_API_KEY or OPENAI_API_KEY to the backend .env file.',
      );
    }
  }

  // ---------- generating ----------

  async generateProjectStory(projectId: number): Promise<Publication> {
    this.requireAi();
    const project = await this.projects.findOne(projectId);

    const prompt = buildStoryPrompt(project);
    const parsed = toTitleAndBody(await this.ai.complete(prompt.system, prompt.user));
    if (!parsed) throw new ServiceUnavailableException('The AI did not return a usable answer. Please try again.');

    return this.savePublication({
      kind: PublicationKind.PROJECT_STORY,
      title: parsed.title,
      body: parsed.body,
      imageUrl: project.imageUrl ?? null,
      sourceProjectId: project.id,
    });
  }

  async generateDesignConcept(): Promise<Publication> {
    this.requireAi();
    const projects = await this.projects.findAll();

    const prompt = buildDesignPrompt(projects, this.currentSeason());
    const parsed = toTitleAndBody(await this.ai.complete(prompt.system, prompt.user));
    if (!parsed) throw new ServiceUnavailableException('The AI did not return a usable answer. Please try again.');

    let imageUrl: string | null = null;
    if (this.ai.imageEnabled) {
      const image = await this.ai.generateImage(buildImagePrompt(parsed));
      if (image) imageUrl = await this.saveImage(image);
    }

    return this.savePublication({
      kind: PublicationKind.DESIGN_CONCEPT,
      title: parsed.title,
      body: parsed.body,
      imageUrl,
    });
  }

  /** Works even without an AI key: then it simply proposes the default look for the season. */
  async proposeTheme(): Promise<SiteTheme> {
    const season = this.currentSeason();
    const active = await this.themes.findOne({ where: { status: ThemeStatus.ACTIVE } });

    let tokens = defaultThemeForSeason(season);
    let aiGenerated = false;
    if (this.ai.isEnabled) {
      const prompt = buildThemePrompt(season, active?.name);
      const answer = await this.ai.complete(prompt.system, prompt.user, 400);
      const json = parseJsonObject(answer);
      if (json) {
        tokens = sanitizeTheme(json, season);
        aiGenerated = true;
      }
    }

    const theme = await this.themes.save(
      this.themes.create({ ...tokens, status: ThemeStatus.DRAFT, aiGenerated }),
    );
    return this.autoPublish ? this.activateTheme(theme.id) : theme;
  }

  /**
   * Weekly routine: one story for a completed project that has none yet, one design concept,
   * and a new theme when the season has changed.
   */
  async generateWeeklyContent(): Promise<void> {
    if (!this.ai.isEnabled) return;

    try {
      const all = await this.projects.findAll();
      const done = new Set(
        (await this.publications.find({ where: { kind: PublicationKind.PROJECT_STORY } }))
          .map((p) => p.sourceProjectId)
          .filter((id): id is number => typeof id === 'number'),
      );
      const next = all.find((p) => p.status?.toUpperCase() === 'COMPLETED' && !done.has(p.id));
      if (next) await this.generateProjectStory(next.id);
    } catch (error) {
      this.logger.error(`Weekly project story failed: ${error instanceof Error ? error.message : error}`);
    }

    try {
      await this.generateDesignConcept();
    } catch (error) {
      this.logger.error(`Weekly design concept failed: ${error instanceof Error ? error.message : error}`);
    }

    try {
      const active = await this.themes.findOne({ where: { status: ThemeStatus.ACTIVE } });
      const pending = await this.themes.count({ where: { status: ThemeStatus.DRAFT } });
      if (pending === 0 && (!active || active.season !== this.currentSeason())) await this.proposeTheme();
    } catch (error) {
      this.logger.error(`Weekly theme check failed: ${error instanceof Error ? error.message : error}`);
    }
  }

  // ---------- publications ----------

  private async savePublication(data: Partial<Publication>): Promise<Publication> {
    const saved = await this.publications.save(
      this.publications.create({ ...data, aiGenerated: true, status: PublicationStatus.DRAFT }),
    );
    return this.autoPublish ? this.publish(saved.id) : saved;
  }

  private async saveImage(bytes: Buffer): Promise<string | null> {
    try {
      const folder = join(process.cwd(), 'uploads');
      await fs.mkdir(folder, { recursive: true });
      const name = `ai-${randomUUID()}.png`;
      await fs.writeFile(join(folder, name), bytes);
      return `/uploads/${name}`;
    } catch (error) {
      this.logger.error(`Could not save the AI image: ${error instanceof Error ? error.message : error}`);
      return null;
    }
  }

  listPublications(status?: string): Promise<Publication[]> {
    const valid = (Object.values(PublicationStatus) as string[]).includes(status ?? '');
    return this.publications.find({
      where: valid ? { status: status as PublicationStatus } : {},
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  listPublished(limit = 6, kind?: string): Promise<Publication[]> {
    const safeLimit = Math.min(Math.max(Math.trunc(limit) || 6, 1), 24);
    const validKind = (Object.values(PublicationKind) as string[]).includes(kind ?? '');
    return this.publications.find({
      where: {
        status: PublicationStatus.PUBLISHED,
        ...(validKind ? { kind: kind as PublicationKind } : {}),
      },
      order: { publishedAt: 'DESC' },
      take: safeLimit,
    });
  }

  private async getPublication(id: string): Promise<Publication> {
    const found = await this.publications.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Publication ${id} not found`);
    return found;
  }

  async updatePublication(id: string, data: { title?: unknown; body?: unknown }): Promise<Publication> {
    const publication = await this.getPublication(id);
    const title = clip(data.title, 160);
    const body = clip(data.body, 4000);
    if (data.title !== undefined && !title) throw new BadRequestException('Title cannot be empty.');
    if (data.body !== undefined && !body) throw new BadRequestException('Text cannot be empty.');
    if (title) publication.title = title;
    if (body) publication.body = body;
    return this.publications.save(publication);
  }

  async publish(id: string): Promise<Publication> {
    const publication = await this.getPublication(id);
    if (publication.status === PublicationStatus.PUBLISHED) return publication;
    publication.status = PublicationStatus.PUBLISHED;
    publication.publishedAt = new Date();
    const saved = await this.publications.save(publication);
    void this.notifyUsers(saved);
    return saved;
  }

  async reject(id: string): Promise<Publication> {
    const publication = await this.getPublication(id);
    publication.status = PublicationStatus.REJECTED;
    return this.publications.save(publication);
  }

  async removePublication(id: string): Promise<{ message: string }> {
    const publication = await this.getPublication(id);
    await this.publications.remove(publication);
    return { message: 'Publication deleted.' };
  }

  /** Only when AI_EMAIL_ON_PUBLISH=true. Recipients are hidden from each other (BCC). */
  private async notifyUsers(publication: Publication): Promise<void> {
    if (this.config.get<string>('AI_EMAIL_ON_PUBLISH')?.trim() !== 'true') return;
    try {
      const emails = (await this.users.findAll()).map((u) => u.email).filter(Boolean);
      if (emails.length === 0) return;
      await this.mailer.sendMail({
        bcc: emails,
        subject: `[House Design] ${publication.title}`,
        text: `${publication.title}\n\n${publication.body}`,
      });
    } catch (error) {
      this.logger.error(`Could not send the e-mail notification: ${error instanceof Error ? error.message : error}`);
    }
  }

  // ---------- themes ----------

  listThemes(): Promise<SiteTheme[]> {
    return this.themes.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  getActiveTheme(): Promise<SiteTheme | null> {
    return this.themes.findOne({ where: { status: ThemeStatus.ACTIVE } });
  }

  private async getTheme(id: string): Promise<SiteTheme> {
    const found = await this.themes.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`Theme ${id} not found`);
    return found;
  }

  async activateTheme(id: string): Promise<SiteTheme> {
    const theme = await this.getTheme(id);
    await this.themes.update(
      { status: ThemeStatus.ACTIVE, id: Not(theme.id) },
      { status: ThemeStatus.ARCHIVED },
    );
    theme.status = ThemeStatus.ACTIVE;
    theme.activatedAt = new Date();
    return this.themes.save(theme);
  }

  async rejectTheme(id: string): Promise<SiteTheme> {
    const theme = await this.getTheme(id);
    theme.status = ThemeStatus.REJECTED;
    return this.themes.save(theme);
  }

  async removeTheme(id: string): Promise<{ message: string }> {
    const theme = await this.getTheme(id);
    if (theme.status === ThemeStatus.ACTIVE) {
      throw new BadRequestException('Activate another theme before deleting the active one.');
    }
    await this.themes.remove(theme);
    return { message: 'Theme deleted.' };
  }
}
