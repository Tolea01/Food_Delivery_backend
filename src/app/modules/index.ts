import { AuthModule } from '@auth/auth.module';
import { CountryModule } from '@country/country.module';
import { LocationModule } from '@location/location.module';
import { OrderCoCustomerModule } from '@order-co-customer/order-co-customer.module';
import { RegionModule } from '@region/region.module';
import { UserModule } from '@user/user.module';
import { ProductCategoriesModule } from '@product-categories/product-categories.module';
import { ProductsModule } from '@products/products.module';

export default [
  AuthModule,
  CountryModule,
  LocationModule,
  OrderCoCustomerModule,
  RegionModule,
  UserModule,
  ProductCategoriesModule,
  ProductsModule,
];
