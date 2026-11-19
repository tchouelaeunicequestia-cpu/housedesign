import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OnEvent } from '@nestjs/event-emitter';
import { AiContentService } from '../ai-content/ai-content.service';
import { AiTextService } from '../ai-content/ai-text.service';

/**
 * Runs the AI routines on their own, so the engineer does not have to.
 * Everything it creates is a DRAFT that waits for approval in the admin area,
 * unless AI_AUTO_PUBLISH=true is set in the .env file.
 */
@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);

  constructor(
    private readonly content: AiContentService,
    private readonly ai: AiTextService,
  ) {
    if (!this.ai.isEnabled) {
      this.logger.warn(
        'AI routines are off. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in the backend .env file to enable them.',
      );
    }
  }

  // Every Monday at 08:00: a story for a finished project, a new design concept, and a seasonal theme check.
  @Cron('0 8 * * 1')
  async runWeeklyRoutine() {
    if (!this.ai.isEnabled) return;
    this.logger.log('Running the weekly AI content routine...');
    await this.content.generateWeeklyContent();
  }

  // As soon as a project is marked Completed, write a draft showcase post about it.
  @OnEvent('project.completed')
  async handleProjectCompletedEvent(payload: { projectId: string; projectTitle: string; notes: string }) {
    if (!this.ai.isEnabled) return;

    try {
      await this.content.generateProjectStory(Number(payload.projectId));
      this.logger.log(`Draft story created for project ${payload.projectId}.`);
    } catch (error) {
      this.logger.error(
        `Could not create a story for project ${payload.projectId}: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
