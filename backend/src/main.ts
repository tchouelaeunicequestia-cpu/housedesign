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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Enable CORS for both Development and Production
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'https://housedesign-production.up.railway.app' // Your Vercel frontend domain
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Set Global Prefix so all routes automatically start with /api
  app.setGlobalPrefix('api');

  // 3. Static Assets (kept from your original code)
  const uploadDir = join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });

  // 4. Pipes
  app.useGlobalPipes(new ValidationPipe());

  // 5. Swagger Configuration (Changed route to /api-docs to avoid prefix conflict)
  const config = new DocumentBuilder()
    .setTitle('Civil Engineer Platform API')
    .setDescription('Interactive API portal')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 6. Start Server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();