import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Required
import { join } from 'path'; // Required

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
      'http://localhost:3000'
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();