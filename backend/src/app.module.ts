import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Import the controller and service
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AssetModule } from './asset/asset.module';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: true,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    AuthModule,
    UserModule,
    AssetModule,
    ProjectModule,
    MediaModule,
  ],
  // 2. Register them here so NestJS can see them
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }