import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function buildTypeOrmOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Create a .env file with your Neon connection string.',
    );
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    autoLoadEntities: true,
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}
