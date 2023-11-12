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
import { EntityManager, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import appError from '@app/config/appError';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: any): Promise<Order> {
    try {
      return await this.entityManager.transaction(
        async (transaction: EntityManager): Promise<Order> => {
          const existOrder: Order | undefined = await this.orderRepository.findOne({
            where: createOrderDto,
          });

          if (existOrder) {
            throw new BadRequestException(appError.ORDER_EXIST);
          } else {
            createOrderDto.created_by = user.id;
            return await transaction.save(Order, createOrderDto);
          }
        },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
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
        await this.orderRepository.createQueryBuilder('order');

      queryBuilder
        .orderBy(sortBy ? `order.${sortBy}` : '1=1', orderBy)
        .andWhere(number ? 'order.number = :number' : '1=1', { number })
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
        .andWhere('(product.deleted_by IS NULL AND product.deleted_at IS NULL)')
        .skip((page - 1) * pageSize)
        .take(pageSize);

      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Order | undefined> {
    try {
      return await this.orderRepository.findOneOrFail({
        where: { id, deleted_at: IsNull() },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getOne(id: number): Promise<Order | undefined> {
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
  ): Promise<Partial<Order>> {
    try {
      return await this.entityManager.transaction(
        async (transaction: EntityManager): Promise<Partial<Order>> => {
          await this.findOne(id);

          updateOrderDto.updated_by = user.id;
          updateOrderDto.updated_at = new Date();

          await transaction.update(Order, id, updateOrderDto);

          return updateOrderDto;
        },
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      return await this.entityManager.transaction(
        async (transaction: EntityManager): Promise<void> => {
          await transaction.delete(Order, id);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeDeleteValues(id: number): Promise<void> {
    try {
      return await this.entityManager.transaction(
        async (transaction: EntityManager): Promise<void> => {
          const order: Order | undefined = await this.getOne(id);

          order.deleted_by = null;
          order.deleted_at = null;

          await transaction.save(Order, order);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deletedBy(id: number, user: any): Promise<void> {
    try {
      return await this.entityManager.transaction(
        async (transaction: EntityManager): Promise<void> => {
          const order: Order | undefined = await this.getOne(id);

          order.deleted_by = user.id;
          order.deleted_at = new Date();

          await transaction.save(Order, order);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
