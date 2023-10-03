import { config } from "dotenv";
import * as process from "process";

config();

const ConfigEnv = {
  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  DOCS_TITLE: process.env.DOCS_TITLE,
  DOCS_DESCRIPTION: process.env.DOCS_DESCRIPTION,
  DOCS_VERSION: process.env.DOCS_VERSION,
  DOCS_PATH: process.env.DOCS_PATH,
  APP_PORT: process.env.APP_PORT
};

export default ConfigEnv;