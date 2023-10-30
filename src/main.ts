import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";
import buildApiDocs from "./app/docs/swagger.builder";
import { I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";

dotenv.config();

async function bootstrap(): Promise<void> {
  const configService: ConfigService = new ConfigService();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalFilters(new I18nValidationExceptionFilter());

  buildApiDocs(app);

  await app.listen(3000);
}

bootstrap();