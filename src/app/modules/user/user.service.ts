import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, EntityManager } from 'typeorm';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) { }

  async create(userData: CreateUserDto): Promise<any> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const existUser = await transactionalEntityManager.findOne(User,
        {
          where: { username: userData.username }
        });

      if (existUser) throw new BadRequestException('This user already exists');

      const user = await transactionalEntityManager.save(User, {
        username: userData.username,
        password: await argon2.hash(userData.password),
      });

      return {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  }

  async getAllUsers(page: number, itemsPerPage: number, sort: string): Promise<User[]> {
    const skip = (page - 1) * itemsPerPage;
    let queryBuilder = this.userRepository.createQueryBuilder('user');

    if (sort) {
      const [field, order] = sort.split(':');

      if (field && order) {
        queryBuilder = queryBuilder.orderBy(`user.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
      }
    }

    queryBuilder = queryBuilder.skip(skip).take(itemsPerPage);

    return await queryBuilder.getMany();
  }

  async getUserById(id: number): Promise<User> {
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

      if (updateUser.username !== undefined && updateUser !== user.username) {
        updatedFields.username = updateUser.username;
      }

      if (updateUser.password) {
        updatedFields.password = await argon2.hash(updateUser.password)
      }

      const updateResult = await transactionalEntityManager.update(User, id, updatedFields);

      return updatedFields;
    });
  }

  async removeUser(id: number): Promise<any> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const user = await this.getUserById(id);
      const removeResult = await transactionalEntityManager.delete(User, id);
    })
  }
}