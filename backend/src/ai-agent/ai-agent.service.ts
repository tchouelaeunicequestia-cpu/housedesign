import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { UserService } from '../user/user.service';
import { AssetService } from '../asset/asset.service';
import { AssetCategory, AssetStatus } from '../asset/entities/asset.entity';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private readonly openai: OpenAI | null;

  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly assetService: AssetService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY')?.trim();
    this.openai = apiKey && apiKey !== 'dummy-key' ? new OpenAI({ apiKey }) : null;

    if (!this.openai) {
      this.logger.warn(
        'OpenAI integration is disabled. Set a valid OPENAI_API_KEY to enable AI routines.',
      );
    }
  }

  // 1. Daily Routine: Generate Industry Tip & Email Users
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async generateDailyIndustryTip() {
    if (!this.openai) return;

    this.logger.log('Running daily AI agent routine to generate industry tip...');
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // or gpt-4
        messages: [
          { role: 'system', content: 'You are an expert civil engineer and architect.' },
          { role: 'user', content: 'Write a short (2-3 paragraphs) insightful tip or news piece about modern sustainable civil engineering or home design. Include a catchy title.' }
        ],
      });

      const content = response.choices[0].message.content || '';
      if (!content) return;

      // Split first line (title) from the rest (description)
      const lines = content.split('\n');
      const title = lines[0].replace(/['"]+/g, '').replace('Title: ', '').trim();
      const description = lines.slice(1).join('\n').trim();

      // Create an asset out of it so it's displayed on the platform
      const asset = await this.assetService.create({
        title: title,
        description: description,
        price: 0,
        category: AssetCategory.DESIGN,
        status: AssetStatus.AVAILABLE,
      });

      this.logger.log(`Created new AI Asset: ${asset.title}`);

      // Notify users via email
      await this.notifyUsers('Daily Engineering Tip', `Check out today's insight:\n\n${title}\n\n${description}`);
      
    } catch (error) {
      this.logger.error('Failed to run daily AI routine:', error);
    }
  }

  // 2. Immediate Reaction: When a project is completed
  @OnEvent('project.completed')
  async handleProjectCompletedEvent(payload: { projectId: string; projectTitle: string; notes: string }) {
    if (!this.openai) return;

    this.logger.log(`Handling project.completed event for project ${payload.projectId}...`);
    
    try {
      // Ask AI to summarize the notes into a public-facing asset
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert technical writer for civil engineering.' },
          { role: 'user', content: `Summarize these project completion notes into a polished 2-paragraph public showcase description for our marketplace. Project Title: ${payload.projectTitle}. Notes: ${payload.notes}` }
        ],
      });

      const summary = response.choices[0].message.content || '';

      // Create an asset connected to the project
      const asset = await this.assetService.create({
        title: `Project Showcase: ${payload.projectTitle}`,
        description: summary,
        price: 0,
        category: AssetCategory.DESIGN, // Or maybe object/land
        status: AssetStatus.AVAILABLE,
        projectId: payload.projectId,
      });

      this.logger.log(`Created new Project Showcase Asset: ${asset.title}`);

      // Notify users
      await this.notifyUsers('New Project Completed', `We just completed a new project: ${payload.projectTitle}!\n\nRead the summary:\n${summary}`);
      
    } catch (error) {
      this.logger.error('Failed to handle project.completed event:', error);
    }
  }

  // Helper method to email all users
  private async notifyUsers(subject: string, text: string) {
    try {
      // Get all active users (assuming we want to email everyone)
      const users = await this.userService.findAll();
      const emails = users.map(u => u.email).filter(Boolean);

      if (emails.length === 0) return;

      // BCC keeps every user's email address hidden from the other recipients.
      await this.mailerService.sendMail({
        bcc: emails,
        subject: `[Civil Engineer Platform] ${subject}`,
        text: text,
      });
      
      this.logger.log(`Sent email notification to ${emails.length} users.`);
    } catch (error) {
      this.logger.error('Failed to send email notifications:', error);
    }
  }
}
