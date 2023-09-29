import { Module } from '@nestjs/common';
import { OrderCoCustomerController } from './order_co_customer.controller';
import { OrderCoCustomerService } from './order_co_customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCoCustomer } from './order_co_customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderCoCustomer])
  ],
  controllers: [OrderCoCustomerController],
  providers: [OrderCoCustomerService]
})
export class OrderCoCustomerModule { }
