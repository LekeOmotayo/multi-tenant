/**
 * Multi-Tenant SaaS Backend
 * A scalable backend for multi-tenant SaaS applications
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  Logger.log(
    `🚀 Multi-Tenant SaaS Backend is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📊 Health check: http://localhost:${port}/${globalPrefix}/v1/health`);
  Logger.log(`👋 Hello endpoint: http://localhost:${port}/${globalPrefix}/v1/hello`);
}

bootstrap();
