import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, EntityManager } from 'typeorm';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { paginationConfig } from 'src/app/config';
import appError from 'src/app/config/appError';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  private userProps(user: User): User {
    return {
      ...user,
      password: undefined,
    };
  }

  async create(userData: CreateUserDto): Promise<User> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<User> => {
          const existUser: User | undefined = await transactionalEntityManager.findOne(
            User,
            {
              where: { username: userData.username },
            },
          );

          if (existUser) throw new BadRequestException(appError.USER_EXIST);

          const user: User = await transactionalEntityManager.save(User, {
            ...userData,
            password: await argon2.hash(userData.password),
          });

          return this.userProps(user);
        },
      );
    } catch (error) {
      return error.message;
    }
  }

  async getAllUsers(pagination: {
    itemsPerPage: number;
    page: number;
    sortColumn: string;
    sortOrder: string;
  }): Promise<Partial<User[]>> {
    try {
      const { itemsPerPage, page, sortColumn, sortOrder } = {
        ...paginationConfig,
        ...pagination,
      };

      const take: number = itemsPerPage;
      const skip: number = (page - 1) * itemsPerPage;

      const items: User[] = await this.userRepository.find({
        take,
        skip,
        order: {
          [sortColumn]: sortOrder,
        },
      });

      await this.userRepository.count();

      return items.map((item: User) => this.userProps(item));
    } catch (error) {
      return error.message;
    }
  }

  async getUserById(id: number): Promise<User | undefined> {
    try {
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { username },
      });
    } catch (error) {
      return error;
    }
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<Partial<User>> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<Partial<User>> => {
          await this.getUserById(id);

          if (updateUser.password) {
            updateUser.password = await argon2.hash(updateUser.password);
          }

          await transactionalEntityManager.update(User, id, updateUser);

          return {
            ...updateUser,
            password: updateUser.password ? 'Password updated successfully' : undefined,
          };
        },
      );
    } catch (error) {
      return error.message;
    }
  }

  async removeUser(id: number): Promise<void> {
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager: EntityManager): Promise<void> => {
          await transactionalEntityManager.delete(User, id);
        },
      );
    } catch (error) {
      return error.message;
    }
  }
}
