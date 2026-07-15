import * as fs from 'fs';
import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Force the instantiation of NestJS using the Express platform adapter
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. Ensure the local uploads directory exists on local startup to prevent crashes
  const uploadDir = join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 3. Serve physical static files under the root-relative '/uploads' route prefix
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });

  // Enable CORS cross-origin configuration
  app.enableCors();

  // Route incoming request structural validation
  app.useGlobalPipes(new ValidationPipe());

  // Build the Swagger interactive configuration settings
  const config = new DocumentBuilder()
    .setTitle('Civil Engineer Platform API')
    .setDescription('Interactive API portal to manage users, projects, media, and assets.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Generate mapping document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Listen on environment port or dynamic host fallback
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();