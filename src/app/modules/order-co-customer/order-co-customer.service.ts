import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderCoCustomer } from "./entities/order-co-customer.entity";
import { EntityManager, Repository, SelectQueryBuilder } from "typeorm";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import appError from "@config/appError";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class OrderCoCustomerService {
  constructor(
    @InjectRepository(OrderCoCustomer) private readonly orderCoCustomerRepository: Repository<OrderCoCustomer>,
    private readonly entityManager: EntityManager
  ) {
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<OrderCoCustomer> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<OrderCoCustomer> => {
      const existCustomer: OrderCoCustomer | undefined = await transactionalEntityManager.findOne(OrderCoCustomer, {
        where: createCustomerDto
      });

      if (existCustomer) {
        throw new BadRequestException(appError.CUSTOMER_EXIST);
      } else {
        return await transactionalEntityManager.save(OrderCoCustomer, createCustomerDto);
      }
    });
  }

  async getCustomerById(id: number): Promise<OrderCoCustomer> {
    const customer: OrderCoCustomer | undefined = await this.orderCoCustomerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(appError.CUSTOMER_NOT_FOUND);
    } else {
      return customer;
    }
  }

  async getAllCustomers(name?: string): Promise<OrderCoCustomer[]> {
    const queryBuilder: SelectQueryBuilder<OrderCoCustomer> = await this.orderCoCustomerRepository.createQueryBuilder("orderCoCustomer");

    queryBuilder.where(name ? "orderCoCustomer.name = :name" : "1=1", { name });

    return queryBuilder.getMany();
  }

  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Partial<OrderCoCustomer>> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Partial<OrderCoCustomer>> => {
      await this.getCustomerById(id);
      await transactionalEntityManager.update(OrderCoCustomer, id, updateCustomerDto);

      return updateCustomerDto;
    });
  }

  async removeCustomer(id: number): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      await transactionalEntityManager.delete(OrderCoCustomer, id);
    });
  }
}
