import { DataSourceOptions } from 'typeorm';
import ConfigEnv from "./config.env";

const DatabaseConnection: DataSourceOptions = {
  type: 'postgres',
  host: ConfigEnv.DB_HOST,
  port: Number(ConfigEnv.DB_PORT),
  username: ConfigEnv.DB_USERNAME,
  password: ConfigEnv.DB_PASSWORD,
  database: ConfigEnv.DB_NAME,
}

export default DatabaseConnection;