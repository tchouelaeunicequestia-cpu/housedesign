import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AiContentService } from './ai-content.service';

/** Admin only: generate, review, approve and reject AI content. */
@ApiTags('ai-content')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ai-content')
export class AiContentController {
  constructor(private readonly content: AiContentService) {}

  @Get('status')
  @ApiOperation({ summary: 'Is the AI configured, and what are the current settings? (Admin Only)' })
  status() {
    return this.content.status();
  }

  @Post('generate/story')
  @ApiOperation({ summary: 'Write a draft post about an existing project (Admin Only)' })
  generateStory(@Body() body: { projectId?: unknown }) {
    const projectId = Number(body?.projectId);
    if (!Number.isInteger(projectId) || projectId <= 0) throw new BadRequestException('projectId must be a number.');
    return this.content.generateProjectStory(projectId);
  }

  @Post('generate/design')
  @ApiOperation({ summary: 'Create a draft new house design concept (Admin Only)' })
  generateDesign() {
    return this.content.generateDesignConcept();
  }

  @Post('generate/theme')
  @ApiOperation({ summary: 'Propose a draft seasonal look for the website (Admin Only)' })
  generateTheme() {
    return this.content.proposeTheme();
  }

  @Get('publications')
  @ApiOperation({ summary: 'List publications, optionally by status: draft, published, rejected (Admin Only)' })
  list(@Query('status') status?: string) {
    return this.content.listPublications(status);
  }

  @Patch('publications/:id')
  @ApiOperation({ summary: 'Edit the title or text of a publication (Admin Only)' })
  update(@Param('id') id: string, @Body() body: { title?: unknown; body?: unknown }) {
    return this.content.updatePublication(id, body ?? {});
  }

  @Post('publications/:id/publish')
  @ApiOperation({ summary: 'Approve and publish (Admin Only)' })
  publish(@Param('id') id: string) {
    return this.content.publish(id);
  }

  @Post('publications/:id/reject')
  @ApiOperation({ summary: 'Reject a draft (Admin Only)' })
  reject(@Param('id') id: string) {
    return this.content.reject(id);
  }

  @Delete('publications/:id')
  @ApiOperation({ summary: 'Delete a publication (Admin Only)' })
  remove(@Param('id') id: string) {
    return this.content.removePublication(id);
  }

  @Get('themes')
  @ApiOperation({ summary: 'List seasonal themes (Admin Only)' })
  themes() {
    return this.content.listThemes();
  }

  @Post('themes/:id/activate')
  @ApiOperation({ summary: 'Make this theme the live look of the website (Admin Only)' })
  activateTheme(@Param('id') id: string) {
    return this.content.activateTheme(id);
  }

  @Post('themes/:id/reject')
  @ApiOperation({ summary: 'Reject a proposed theme (Admin Only)' })
  rejectTheme(@Param('id') id: string) {
    return this.content.rejectTheme(id);
  }

  @Delete('themes/:id')
  @ApiOperation({ summary: 'Delete a theme (Admin Only)' })
  removeTheme(@Param('id') id: string) {
    return this.content.removeTheme(id);
  }
}

/** Public: only published posts. */
@ApiTags('publication')
@Controller('publication')
export class PublicPublicationController {
  constructor(private readonly content: AiContentService) {}

  @Get()
  @ApiOperation({ summary: 'Latest published posts (Public)' })
  async latest(@Query('limit') limit?: string, @Query('kind') kind?: string) {
    const items = await this.content.listPublished(Number(limit) || 6, kind);
    return items.map((item) => ({
      id: item.id,
      kind: item.kind,
      title: item.title,
      body: item.body,
      imageUrl: item.imageUrl,
      aiGenerated: item.aiGenerated,
      publishedAt: item.publishedAt,
    }));
  }
}

/** Public: the live seasonal look (null when none is active). */
@ApiTags('theme')
@Controller('theme')
export class PublicThemeController {
  constructor(private readonly content: AiContentService) {}

  @Get('active')
  @ApiOperation({ summary: 'The active seasonal theme (Public)' })
  async active() {
    const theme = await this.content.getActiveTheme();
    if (!theme) return null;
    const { name, season, tint, tintOpacity, accent, banner } = theme;
    return { name, season, tint, tintOpacity, accent, banner };
  }
}
