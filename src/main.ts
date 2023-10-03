import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import buildApiDocs from "./app/docs/swagger.builder";
import ConfigEnv from "./app/config/config.env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  buildApiDocs(app);

  await app.listen(ConfigEnv.DB_PORT);
}

bootstrap();