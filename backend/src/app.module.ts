import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TranslationModule,
    AuthModule,
    UserModule,
    AssetModule,
    ProjectModule,
    MediaModule,
    EngineerProfileModule,
    AppointmentModule,
  ],
  controllers: [AppController], 
  providers: [AppService],       
})
export class AppModule {}