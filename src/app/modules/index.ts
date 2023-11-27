import { AuthModule } from '@auth/auth.module';
import { CountryModule } from '@country/country.module';
import { LocationModule } from '@location/location.module';
import { OrderCoCustomerModule } from '@order-co-customer/order-co-customer.module';
import { RegionModule } from '@region/region.module';
import { UserModule } from '@user/user.module';
import { ProductCategoryModule } from '@product-category/product-category.module';
import { ProductModule } from '@product/product.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';

export default [
  AuthModule,
  CountryModule,
  LocationModule,
  OrderCoCustomerModule,
  RegionModule,
  UserModule,
  ProductCategoryModule,
  ProductModule,
  CustomerModule,
  OrderModule,
];
