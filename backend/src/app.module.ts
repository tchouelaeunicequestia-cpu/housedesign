import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AssetModule } from './asset/asset.module';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { ProjectModule } from './project/project.module';
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
    AuthModule,
    UserModule,
    AssetModule,
    ProjectModule,
    MediaModule,
  ],
  controllers: [AppController], // IMPORTANT: Must be here
  providers: [AppService],       // IMPORTANT: Must be here
})
export class AppModule {}