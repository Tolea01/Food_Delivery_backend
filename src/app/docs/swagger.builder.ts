import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

const buildApiDocs = (app: any): void => {
  const config = new DocumentBuilder()
    .setTitle(process.env.DOCS_TITLE || "API")
    .setDescription(process.env.DOCS_DESCRIPTION || "description...")
    .setVersion(process.env.DOCS_VERSION || "1.0")
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(process.env.DOCS_PATH || "/docs", app, document);
};

export default buildApiDocs;
