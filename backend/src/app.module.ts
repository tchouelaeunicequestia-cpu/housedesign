import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
          synchronize: true, // Auto sync schema updates with Neon database
          ssl: {
            rejectUnauthorized: false, // Required for secure cloud database instances
          },
        };
      },
    }),
    AuthModule,
    UserModule,
    AssetModule,
    ProjectModule,
    MediaModule, // 👈 Registering our brand new MediaModule
  ],
})
export class AppModule {}