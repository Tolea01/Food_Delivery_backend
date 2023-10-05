import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository, EntityManager } from "typeorm";
import * as argon2 from "argon2";
import { UpdateUserDto } from "./dto/update-user.dto";
import { paginationConfig } from "src/app/config";
import appError from "src/app/config/appError";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) {
  }

  private userProps(user: User): User {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      password: undefined
    };
  }

  async create(userData: CreateUserDto): Promise<Partial<User>> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const existUser: User = await transactionalEntityManager.findOne(User,
        {
          where: { username: userData.username }
        });

      if (existUser) throw new BadRequestException(appError.USER_EXIST);

      const user = await transactionalEntityManager.save(User, {
        username: userData.username,
        password: await argon2.hash(userData.password),
        role: userData.role
      });

      return this.userProps(user);
    });
  }

  async getAllUsers(pagination: {
    itemsPerPage: number,
    page: number,
    sortColumn: string,
    sortOrder: string
  }): Promise<Partial<User[]>> {
    const { itemsPerPage, page, sortColumn, sortOrder } = {
      ...paginationConfig,
      ...pagination
    };

    const take: number = itemsPerPage;
    const skip: number = (page - 1) * itemsPerPage;

    const items: User[] = await this.userRepository.find({
      take,
      skip,
      order: {
        [sortColumn]: sortOrder
      }
    });

    const totalUsers: number = await this.userRepository.count();
    const data: User[] = items.map(item => this.userProps(item));

    return data;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const user: User = await this.userRepository.findOne({ where: { id } });

    return this.userProps(user);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user: User = await this.userRepository.findOne({ where: { username } });

    return user;
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<Partial<User>> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const user: User = await this.getUserById(id);
      const updatedFields: Partial<User> = {};

      if (!user) throw new NotFoundException(appError.USER_NOT_FOUND);

      if (updateUser !== user.username) {
        updatedFields.username = updateUser.username;
      }

      if (updateUser.password) {
        updatedFields.password = await argon2.hash(updateUser.password);
      }

      if (updateUser.role) {
        updatedFields.role = updateUser.role;
      }

      const updateResult = await transactionalEntityManager.update(User, id, updatedFields);

      return {
        username: updatedFields.username,
        password: "Password updated successfully",
        role: updatedFields.role
      };
    });
  }

  async removeUser(id: number): Promise<void> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const removeResult = await transactionalEntityManager.delete(User, id);
    });
  }
}