import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserListItemDTO } from './dto/user-list-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, EntityManager } from 'typeorm';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { paginationConfig } from 'src/app/config';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) { }

  async create(userData: CreateUserDto): Promise<User> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const existUser = await transactionalEntityManager.findOne(User,
        {
          where: { username: userData.username }
        });

      if (existUser) throw new BadRequestException('This user already exists');

      const user = await transactionalEntityManager.save(User, {
        username: userData.username,
        password: await argon2.hash(userData.password),
        role: userData.role
      });

      return user;
    });
  }

  async getAllUsers(pagination: {
    itemsPerPage: number,
    page: number,
    sortColumn: string,
    sortOrder: string
  }): Promise<UserListItemDTO[]> {
    const { itemsPerPage, page, sortColumn, sortOrder } = {
      ...paginationConfig,
      ...pagination
    };

    const take = itemsPerPage;
    const skip = (page - 1) * itemsPerPage;

    const items = await this.userRepository.find({
      take,
      skip,
      order: {
        [sortColumn]: sortOrder
      }
    });

    const totalUsers = await this.userRepository.count();
    const data = items.map(item => ({
      ...plainToClass(UserListItemDTO, item),
    }))

    return data;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });

    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });

    return user;
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<Partial<User>> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const user = await this.getUserById(id);
      const updatedFields: Partial<User> = {};

      if (!user) throw new NotFoundException('User not found!');

      if (updateUser !== user.username) {
        updatedFields.username = updateUser.username;
      }

      if (updateUser.password) {
        updatedFields.password = await argon2.hash(updateUser.password)
      }

      const updateResult = await transactionalEntityManager.update(User, id, updatedFields);

      return updatedFields;
    });
  }

  async removeUser(id: number): Promise<void> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const removeResult = await transactionalEntityManager.delete(User, id);
    })
  }
}