import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Redirect root URL (/) directly to Swagger UI (/api/docs)
  app.use((req, res, next) => {
    if (req.url === '/') {
      return res.redirect('/api/docs');
    }
    next();
  });

  // Global API Prefix
  app.setGlobalPrefix('api');

  // Serve static assets from the 'uploads' folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Enable CORS for allowed client domains
  app.enableCors({
    origin: [
      'https://housedesign-production.up.railway.app',
      'https://housedesign-production-f3bd.up.railway.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('House Design API')
    .setDescription('Backend API documentation for House Design & Engineer Profile')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();