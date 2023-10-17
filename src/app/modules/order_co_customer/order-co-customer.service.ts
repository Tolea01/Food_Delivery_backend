import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderCoCustomer } from "./entities/order-co-customer.entity";
import { DeleteResult, EntityManager, Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import appError from "../../config/appError";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { UpdateCustomerFields } from "../../interfaces/interfaces";

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
    let queryBuilder: SelectQueryBuilder<OrderCoCustomer> = await this.orderCoCustomerRepository.createQueryBuilder("orderCoCustomer");

    if (name) {
      queryBuilder = queryBuilder.where("orderCoCustomer.name = :name", { name });
      return await queryBuilder.getMany();
    } else {
      return await this.orderCoCustomerRepository.find();
    }

    return await this.orderCoCustomerRepository.find();
  }

  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<UpdateCustomerFields> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<UpdateCustomerFields> => {
      const customer: OrderCoCustomer | undefined = await this.getCustomerById(id);
      const updateResult: UpdateResult = await transactionalEntityManager.update(OrderCoCustomer, id, { name: updateCustomerDto.name });

      return { name: updateCustomerDto.name };
    });
  }

  async removeCustomer(id: number): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      const removeCustomer: DeleteResult = await transactionalEntityManager.delete(OrderCoCustomer, id);
    });
  }
}
