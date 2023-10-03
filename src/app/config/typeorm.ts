import { DataSource, DataSourceOptions } from 'typeorm';
import ConfigEnv from "./config.env";

const databaseConnection: DataSourceOptions = {
  type: 'postgres',
  host: ConfigEnv.DB_HOST,
  port: Number(ConfigEnv.DB_PORT),
  username: ConfigEnv.DB_USERNAME,
  password: ConfigEnv.DB_PASSWORD,
  database: ConfigEnv.DB_NAME,
  entities: ['dist/app/modules/**/*.entity{.js,.ts}'],
  migrations: ['dist/app/migrations/*{.js,.ts}']
}

const dataSource: DataSource = new DataSource(databaseConnection)

export default dataSource;