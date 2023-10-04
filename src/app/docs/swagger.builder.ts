import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

const buildApiDocs = (app: any): void => {
  const configService: ConfigService = new ConfigService();
  const config = new DocumentBuilder()
    .setTitle(configService.get("DOCS_TITLE") || 'API')
    .setDescription(configService.get("DOCS_DESCRIPTION") || 'description...')
    .setVersion(configService.get("DOCS_VERSION") || '1.0')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(configService.get("DOCS_PATH"), app, document);
};

export default buildApiDocs;