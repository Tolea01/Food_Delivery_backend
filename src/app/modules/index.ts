import { AuthModule } from "./auth/auth.module";
import { CountryModule } from "./country/country.module";
import { LocationModule } from "./location/location.module";
import { OrderCoCustomerModule } from "./order_co_customer/order_co_customer.module";
import { RegionModule } from "./region/region.module";
import { UserModule } from "./user/user.module";

export default [
  AuthModule,
  CountryModule,
  LocationModule,
  OrderCoCustomerModule,
  RegionModule,
  UserModule
]