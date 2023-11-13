import { Module } from '@nestjs/common';
import { OrderCoCustomerController } from './order-co-customer.controller';
import { OrderCoCustomerService } from './order-co-customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCoCustomer } from './entities/order-co-customer.entity';
//todo split this module into OrderModule. 1 module can contain 2 or more entities. Module = feature
@Module({
  imports: [TypeOrmModule.forFeature([OrderCoCustomer])],
  controllers: [OrderCoCustomerController],
  providers: [OrderCoCustomerService],
})
export class OrderCoCustomerModule {}
