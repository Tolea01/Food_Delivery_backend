import { User } from '@user/entities/user.entity';
import { Order } from '@modules/order/entities/order.entity';
import { Customer } from '@modules/customer/entities/customer.entity';
import { Location } from '@location/entities/location.entity';
import { Region } from '@region/entities/region.entity';
import { Country } from '@country/entities/country.entity';
import { Product } from '@product/entities/product.entity';
import { OrderCoCustomer } from '@modules/order/entities/order-co-customer.entity';
import { ProductCategory } from '@product-category/entities/product-category.entity';

export const databaseConfig = (): any => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [
    User,
    Order,
    Customer,
    Location,
    Region,
    Country,
    Product,
    OrderCoCustomer,
    ProductCategory,
  ],
});

export default databaseConfig;
