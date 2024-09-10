import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(8080);
  Logger.log(`Server running on http://localhost:8080`, 'Bootstrap');
}

bootstrap();
