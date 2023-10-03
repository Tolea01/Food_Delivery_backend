import { DataSource, DataSourceOptions } from 'typeorm';
import DatabaseConnection from "./databaseConnection";

const AppDataSource: DataSourceOptions = {
...DatabaseConnection,
  entities: ['dist/app/modules/**/*.entity{.js,.ts}'],
  migrations: ['dist/app/migrations/*{.js,.ts}']
}

const dataSource: DataSource = new DataSource(AppDataSource)

export default dataSource;