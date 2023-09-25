import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import buildApiDocs from './app/docs/swagger.builder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  buildApiDocs(app)

  await app.listen(3000);
}
bootstrap();