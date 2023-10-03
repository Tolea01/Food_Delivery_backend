import ConfigEnv from "./config.env";

export const databaseConfig = async (): Promise<any> => ({
  type: 'postgres',
  host: ConfigEnv.DB_HOST,
  port: Number(ConfigEnv.DB_PORT),
  username: ConfigEnv.DB_USERNAME,
  password: ConfigEnv.DB_PASSWORD,
  database: ConfigEnv.DB_NAME,
  synchronize: false,
  autoloadEntities: false,
  entities: [__dirname + '/../**/*.entity{.js, .ts}']
});

export default databaseConfig;