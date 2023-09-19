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

  async create(userData: CreateUserDto): Promise<{ message: string }> {
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

      return { message: "User created successfully." };
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

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<{ message: string }> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const user = await this.getUserById(id);
      const updateResult = await transactionalEntityManager.update(User, id, updateUser);

      return updateResult.affected > 0 ? { message: 'User updated successfully' } : { message: 'User not updated' };
    });
  }

  async removeUser(id: number): Promise<{ message: string }> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const user = await this.getUserById(id);
      const removeResult = await transactionalEntityManager.delete(User, id);

      return removeResult.affected > 0 ? { message: 'User deleted successfully' } : { message: 'User not deleted' };
    })
  }
}