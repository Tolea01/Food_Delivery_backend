import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCoCustomer } from '../order/entities/order-co-customer.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import appError from '@config/appError';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import handleExceptionError from '@app/helpers/handle-exception-error';

@Injectable()
export class OrderCoCustomerService {
  constructor(
    @InjectRepository(OrderCoCustomer)
    private readonly orderCoCustomerRepository: Repository<OrderCoCustomer>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<OrderCoCustomer> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<OrderCoCustomer> => {
          const existCustomer: OrderCoCustomer | undefined =
            await this.orderCoCustomerRepository.findOne({
              where: createCustomerDto,
            });

          if (existCustomer) {
            throw new BadRequestException(appError.CUSTOMER_EXIST);
          } else {
            return await transactionalEntityManager.save(
              OrderCoCustomer,
              createCustomerDto,
            );
          }
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async getCustomerById(id: number): Promise<OrderCoCustomer> {
    try {
      return await this.orderCoCustomerRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getAllCustomers(name?: string): Promise<OrderCoCustomer[]> {
    try {
      const queryBuilder: SelectQueryBuilder<OrderCoCustomer> =
        await this.orderCoCustomerRepository.createQueryBuilder('orderCoCustomer');

      queryBuilder.where(name ? 'orderCoCustomer.name = :name' : '1=1', { name });

      return queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Partial<OrderCoCustomer>> {
    try {
      return await this.entityManager.transaction(
        async (
          transactionalEntityManager: EntityManager,
        ): Promise<Partial<OrderCoCustomer>> => {
          await this.getCustomerById(id);
          await transactionalEntityManager.update(OrderCoCustomer, id, updateCustomerDto);
          return updateCustomerDto;
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async removeCustomer(id: number): Promise<void> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<void> => {
          await transactionalEntityManager.delete(OrderCoCustomer, id);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
