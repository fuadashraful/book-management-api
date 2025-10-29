import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties not in the DTO
      forbidNonWhitelisted: true, // throw error for extra fields
      transform: true, // transform plain JSON to DTO instance
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
