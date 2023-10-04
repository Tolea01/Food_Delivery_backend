import { ConfigService } from "@nestjs/config";

export const databaseConfig = async (configService: ConfigService): Promise<any> => ({
  type: configService.get('DB_TYPE') || 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: configService.get('DB_PORT') || 5432,
  username: configService.get('DB_USERNAME') || 'postgres',
  password: configService.get('DB_PASSWORD') || 'backend_dev',
  database: configService.get('DB_NAME') || 'food_delivery',
  synchronize: true,
  entities: [__dirname + '/../config/../**/*.entity{.js, .ts}']
});

export default databaseConfig;