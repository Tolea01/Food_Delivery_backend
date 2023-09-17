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

  private async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

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

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();

    if (!users || users.length === 0) throw new NotFoundException('Users not found!');

    return users;
  }

  async getOneUser(id: number): Promise<User | undefined> {
    const user = await this.findUserById(id);

    return user;
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<{ message: string }> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const user = await this.findUserById(id);
      const updateResult = await transactionalEntityManager.update(User, id, updateUser);

      return updateResult.affected > 0 ? { message: 'User updated successfully' } : { message: 'User not updated' };
    });
  }

  async removeUser(id: number): Promise<{ message: string }> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const user = await this.findUserById(id);
      const removeResult = await transactionalEntityManager.delete(User, id);

      return removeResult.affected > 0 ? { message: 'User deleted successfully' } : { message: 'User not deleted' };
    })
  }
}