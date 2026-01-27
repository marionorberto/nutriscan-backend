import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as express from 'express'; // Importe assim

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.setGlobalPrefix('api/v1/nutriscan');
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const server = app.getHttpServer();
  server.setTimeout(120000); // 2 minutos (em milissegundos)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
