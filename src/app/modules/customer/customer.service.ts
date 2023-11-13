import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import appError from '@config/appError';
import { LocationService } from '@location/location.service';
import { User } from '@user/entities/user.entity';
import handleExceptionError from '@app/helpers/handle-exception-error';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    private readonly entityManager: EntityManager,
    private readonly locationService: LocationService,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    user: Partial<User>,
  ): Promise<Customer> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<Customer> => {
          const existCustomer: Customer | undefined =
            await this.customerRepository.findOne({
              where: createCustomerDto,
            });

          if (existCustomer) {
            throw new BadRequestException(appError.CUSTOMER_EXIST);
          } else {
            await this.locationService.getLocationById(createCustomerDto.location_id);
            createCustomerDto.user_id = user.id;
            return await transactionalEntityManager.save(Customer, createCustomerDto);
          }
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async findAll(
    name?: string,
    address?: string,
    phone?: string,
    email?: string,
    orderBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<Customer[]> {
    try {
      const queryBuilder: SelectQueryBuilder<Customer> =
        await this.customerRepository.createQueryBuilder('customer');

      queryBuilder
        .where(name ? 'customer.name = :name' : '1=1', { name })
        .andWhere(address ? 'customer.address = :address' : '1=1', { address })
        .andWhere(phone ? 'customer.phone = :phone' : '1=1', { phone })
        .andWhere(email ? 'customer.email = :email' : '1=1', { email })
        .orderBy(
          sortOrder && orderBy ? `customer.${orderBy}` : '1=1',
          sortOrder || 'ASC',
        );

      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<Customer> {
    try {
      return await this.customerRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Partial<Customer>> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<Partial<Customer>> => {
          await this.findOne(id);

          if (updateCustomerDto.location_id) {
            await this.locationService.getLocationById(updateCustomerDto.location_id);
          }

          await transactionalEntityManager.update(Customer, id, updateCustomerDto);
          return updateCustomerDto;
        },
      );
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<void> => {
          await transactionalEntityManager.delete(Customer, id);
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
