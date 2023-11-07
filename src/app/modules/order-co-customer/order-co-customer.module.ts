import { Module } from '@nestjs/common';
import { OrderCoCustomerController } from './order-co-customer.controller';
import { OrderCoCustomerService } from './order-co-customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCoCustomer } from './entities/order-co-customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderCoCustomer])],
  controllers: [OrderCoCustomerController],
  providers: [OrderCoCustomerService],
})
export class OrderCoCustomerModule {}
