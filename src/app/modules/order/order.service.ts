import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { OrderCoCustomer } from '@modules/order/entities/order-co-customer.entity';
import handleExceptionError from '@helpers/handle-exception-error';
import { CreateOrderResponseDto } from '@modules/order/dto/create-order.response.dto';
import { plainToClass } from 'class-transformer';
import { OrderItemDto } from '@modules/order/dto/order.item.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderCoCustomer)
    private readonly orderCustomer: Repository<OrderCoCustomer>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: any,
  ): Promise<CreateOrderResponseDto> {
    try {
      const order: Order | undefined = await this.orderRepository.findOne({
        where: createOrderDto,
      });

      createOrderDto.created_by = user.id;
      createOrderDto.customer_id = user.id;
      await this.orderRepository.save(createOrderDto);
      return plainToClass(CreateOrderResponseDto, order);
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async findAll(
    sortBy?: string,
    orderBy?: 'ASC' | 'DESC',
    number?: string,
    status?: string,
    deliveryMethod?: string,
    deliveryLocation?: string,
    deliveryAddress?: string,
    contactPhone?: string,
    contactEmail?: string,
    paymentMethod?: string,
    joinCode?: string,
    page?: number,
    pageSize?: number,
  ): Promise<Order[]> {
    try {
      const queryBuilder: SelectQueryBuilder<Order> =
        this.orderRepository.createQueryBuilder('order');

      queryBuilder
        .orderBy(sortBy ? `order.${sortBy}` : '1=1', orderBy)
        .andWhere(number ? 'order.number = :number' : '1=1', { number }) //try to add dynamic andWhere
        .andWhere(status ? 'order.status = :status' : '1=1', { status })
        .andWhere(deliveryMethod ? 'order.delivery_method = :deliveryMethod' : '1=1', {
          deliveryMethod,
        })
        .andWhere(
          deliveryLocation ? 'order.delivery_location = :deliveryLocation' : '1=1',
          {
            deliveryLocation,
          },
        )
        .andWhere(deliveryAddress ? 'order.delivery_address = :deliveryAddress' : '1=1', {
          deliveryAddress,
        })
        .andWhere(contactPhone ? 'order.contact_phone = :contactPhone' : '1=1', {
          contactPhone,
        })
        .andWhere(contactEmail ? 'order.contact_email = :contactEmail' : '1=1', {
          contactEmail,
        })
        .andWhere(paymentMethod ? 'order.payment_method = :paymentMethod' : '1=1', {
          paymentMethod,
        })
        .andWhere(joinCode ? 'order.join_code = :joinCode' : '1=1', {
          joinCode,
        })
        .andWhere('(product.deleted_by IS NULL AND product.deleted_at IS NULL)') //todo .withDeleted()

        .skip((page - 1) * pageSize)
        .take(pageSize);

      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<OrderItemDto | undefined> {
    try {
      return await this.orderRepository.findOneOrFail({
        where: { id, deleted_at: IsNull() },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getOne(id: number): Promise<OrderItemDto | undefined> {
    try {
      return await this.orderRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    user: any,
  ): Promise<UpdateOrderDto> {
    try {
      await this.findOne(id);

      updateOrderDto.updated_by = user.id;
      updateOrderDto.updated_at = new Date();

      await this.orderRepository.update(id, updateOrderDto);

      return updateOrderDto;
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.orderRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async restoreDeletedValues(id: number): Promise<void> {
    try {
      const order: Order | undefined = await this.getOne(id);

      order.deleted_by = null;
      order.deleted_at = null;

      await this.orderRepository.save(order);
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async softDelete(id: number, user: any): Promise<void> {
    try {
      const order: Order | undefined = await this.getOne(id);

      order.deleted_by = user.id;
      order.deleted_at = new Date();

      await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
