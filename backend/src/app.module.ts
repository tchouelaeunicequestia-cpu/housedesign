import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppointmentModule } from './appointment/appointment.module';
import { AssetModule } from './asset/asset.module';
import { AuthModule } from './auth/auth.module';
import { EngineerProfileModule } from './engineer-profile/engineer-profile.module';
import { MediaModule } from './media/media.module';
import { ProjectModule } from './project/project.module';
import { TranslationModule } from './translation/translation.module';
import { UserModule } from './user/user.module';
// import { AiAgentModule } from './ai-agent/ai-agent.module'; // Will create this next
import { AiAgentModule } from './ai-agent/ai-agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: { rejectUnauthorized: false },
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: configService.get<boolean>('SMTP_SECURE', false),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>('SMTP_FROM', '"No Reply" <noreply@example.com>'),
        },
      }),
    }),
    TranslationModule,
    AuthModule,
    UserModule,
    AssetModule,
    ProjectModule,
    MediaModule,
    EngineerProfileModule,
    AppointmentModule,
    AiAgentModule,
  ],
  controllers: [AppController], 
  providers: [AppService],       
})
export class AppModule {}