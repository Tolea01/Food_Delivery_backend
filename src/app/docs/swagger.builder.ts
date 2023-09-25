import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as process from 'process';

const buildApiDocs = (app: any) => {
  const config = new DocumentBuilder()
  .setTitle(process.env.DOCS_TITLE)
  .setDescription(process.env.DOCS_DESCRIPTION)
  .setVersion(process.env.DOCS_VERSION)
  .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(process.env.DOCS_PATH, app, document);
};

export default buildApiDocs;