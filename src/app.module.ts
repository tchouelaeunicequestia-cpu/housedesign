import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Explicitly feeding fields prevents TypeORM from falling back to 127.0.0.1
      host: 'ep-hidden-sunset-atmemedn-pooler.c-9.us-east-1.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 'npg_JyX6uMAi9etG',
      database: 'neondb',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Required for secure Neon connections
      },
    }),
    ProjectModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}