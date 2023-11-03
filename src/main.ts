import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import * as dotenv from "dotenv";
import buildApiDocs from "./app/docs/swagger.builder";
import { I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";
import { INestApplication } from "@nestjs/common";

dotenv.config();

async function bootstrap(): Promise<void> {
  const app: INestApplication<any> = await NestFactory.create(AppModule);

  app
    .useGlobalPipes(new I18nValidationPipe())
    .useGlobalFilters(new I18nValidationExceptionFilter());

  buildApiDocs(app);

  await app.listen(3000);
}

bootstrap();