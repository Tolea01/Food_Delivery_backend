import DatabaseConnection from "./databaseConnection";

export const databaseConfig = async (): Promise<any> => ({
...DatabaseConnection,
  synchronize: false,
  autoloadEntities: false,
  entities: [__dirname + '/../**/*.entity{.js, .ts}']
});

export default databaseConfig;