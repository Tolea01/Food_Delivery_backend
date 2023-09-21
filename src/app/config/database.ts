import { ConfigService } from "@nestjs/config";

export const databaseConfig = async (configService: ConfigService): Promise<any> => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  synchronize: true,
  entities: [__dirname + '/../config/../**/*.entity{.js, .ts}']
});

export default databaseConfig;