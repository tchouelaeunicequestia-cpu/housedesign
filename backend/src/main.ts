import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Required
import { join } from 'path'; // Required
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Added for Swagger

async function bootstrap() {
  // 1. Cast the app to NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // 2. Serve static files from the 'uploads' folder
  // Files will be accessible at: /uploads/your-file.png
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.enableCors({
    origin: [
      'https://housedesign-production.up.railway.app',
      'https://housedesign-production-f3bd.up.railway.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    credentials: true,
  });

  // 3. Configure Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('House Design API')
    .setDescription('API documentation for the backend services')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Because of the global prefix 'api', this will be hosted at /api/docs
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();