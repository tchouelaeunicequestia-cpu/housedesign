import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation for incoming request DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup with JWT support
  const config = new DocumentBuilder()
    .setTitle('HouseDesign API')
    .setDescription('API for architectural project management and material services in Yaoundé')
    .setVersion('1.0')
    .addBearerAuth() // Enables token input field in the interactive UI
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();