import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import {
  AiContentController,
  PublicPublicationController,
  PublicThemeController,
} from './ai-content.controller';
import { AiContentService } from './ai-content.service';
import { AiTextService } from './ai-text.service';
import { Publication } from './entities/publication.entity';
import { SiteTheme } from './entities/site-theme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, SiteTheme]), ProjectModule, UserModule, ConfigModule],
  controllers: [AiContentController, PublicPublicationController, PublicThemeController],
  providers: [AiTextService, AiContentService],
  exports: [AiTextService, AiContentService],
})
export class AiContentModule {}
