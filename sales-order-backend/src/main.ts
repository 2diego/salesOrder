import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Solo permite propiedades definidas en DTOs
    forbidNonWhitelisted: true, // Rechaza propiedades no definidas
    transform: true, // Transforma tipos automáticamente
  }));

  // Configurar CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicación ejecutándose en: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
