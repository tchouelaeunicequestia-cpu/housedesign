import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectDto } from './dto/project.dto';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly translationService: TranslationService,
  ) {}

  async create(projectDto: ProjectDto): Promise<Project> {
    const rawTitle = projectDto.title || projectDto.name || 'Untitled Project';
    const rawDescription = projectDto.description || '';

    // Auto-translate title and description
    const [titlePair, descPair] = await Promise.all([
      this.translationService.translatePair(rawTitle),
      this.translationService.translatePair(rawDescription),
    ]);

    const project = this.projectRepository.create({
      ...projectDto,
      title: rawTitle,
      titleEn: titlePair.en,
      titleFr: titlePair.fr,
      description: rawDescription,
      descriptionEn: descPair.en,
      descriptionFr: descPair.fr,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(locale?: string): Promise<Project[]> {
    const projects = await this.projectRepository.find({
      order: { createdAt: 'DESC' },
    });

    if (!locale) return projects;
    return projects.map((p) => this.localizeProject(p, locale));
  }

  async findOne(id: number, locale?: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    if (!locale) return project;
    return this.localizeProject(project, locale);
  }

  async update(id: number, projectDto: Partial<ProjectDto>): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (projectDto.name && !projectDto.title) {
      projectDto.title = projectDto.name;
    }

    if (projectDto.title && projectDto.title !== project.title) {
      const titlePair = await this.translationService.translatePair(projectDto.title);
      project.titleEn = titlePair.en;
      project.titleFr = titlePair.fr;
    }

    if (projectDto.description && projectDto.description !== project.description) {
      const descPair = await this.translationService.translatePair(projectDto.description);
      project.descriptionEn = descPair.en;
      project.descriptionFr = descPair.fr;
    }

    Object.assign(project, projectDto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<{ message: string }> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await this.projectRepository.remove(project);
    return { message: `Project #${id} deleted successfully` };
  }

  private localizeProject(project: Project, locale: string): Project {
    const isFr = locale.toLowerCase().startsWith('fr');
    return {
      ...project,
      title: isFr ? (project.titleFr || project.title) : (project.titleEn || project.title),
      description: isFr ? (project.descriptionFr || project.description) : (project.descriptionEn || project.description),
    };
  }
}