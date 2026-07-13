import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

const NEON_DB_URL = 'postgresql://neondb_owner:npg_JyX6uMAi9etG@ep-hidden-sunset-atmemedn-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || NEON_DB_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ProjectModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}