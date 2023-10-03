import * as process from 'process'
import { DataSource, DataSourceOptions } from 'typeorm';

const databaseConnection: DataSourceOptions = {
  type: "postgres",
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'backend_dev',
  database: 'food_delivery',
  entities: ['dist/app/modules/**/*.entity{.js,.ts}'],
  migrations: ['dist/app/migrations/*{.js,.ts}']
}

const dataSource = new DataSource(databaseConnection)
export default dataSource;