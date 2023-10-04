import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import buildApiDocs from "./app/docs/swagger.builder";

async function bootstrap(): Promise<void> {
  const configService: ConfigService = new ConfigService();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  buildApiDocs(app);

  await app.listen(configService.get("APP_PORT") || 3000);
}

bootstrap();