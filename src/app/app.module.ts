import { MiddlewareConsumer, Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./config/database";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { CountryModule } from "./modules/country/country.module";
import { LocationModule } from "./modules/location/location.module";
import { RegionModule } from "./modules/region/region.module";
import { OrderCoCustomerModule } from "./modules/order_co_customer/order_co_customer.module";
import publicPaths from "./config/publicPaths";

@Module({
  imports: [
    UserModule,
    AuthModule,
    CountryModule,
    LocationModule,
    RegionModule,
    OrderCoCustomerModule,
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(...publicPaths)
      .forRoutes("*");
  }
}