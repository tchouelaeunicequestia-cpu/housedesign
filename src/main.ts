import { ValidationPipe } from '@nestjs/common';
// src/main.ts
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so your future frontend can talk to this backend
  app.enableCors();

  // Global validation pipe for your DTOs
  app.useGlobalPipes(new ValidationPipe());

  // 1. Build the Swagger Document configuration
  const config = new DocumentBuilder()
    .setTitle('Civil Engineer Platform API')
    .setDescription('The interactive API portal for projects, assets, and user management.')
    .setVersion('1.0')
    .addBearerAuth() // Allows you to test protected routes with JWT tokens later!
    .build();

  // 2. Create the document and set up the /api route
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Use Railway's dynamic PORT or fallback to 3000 locally
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();