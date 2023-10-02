import { DataSource } from "typeorm"
import * as proces from 'process';

const AppDataSource = new DataSource({
  type: "postgres",
  host: proces.env.DB_HOST,
  port: Number(proces.env.DB_PORT),
  username: proces.env.DB_USERNAME,
  password: proces.env.DB_PASSWORD,
  database: proces.env.DB_NAME,
  migrationsTableName: 'migr'
})

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })

export default AppDataSource;