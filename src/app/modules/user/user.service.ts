import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository, EntityManager, UpdateResult, DeleteResult } from "typeorm";
import * as argon2 from "argon2";
import { UpdateUserDto } from "./dto/update-user.dto";
import { paginationConfig } from "src/app/config";
import appError from "src/app/config/appError";
import { UserRole } from "./entities/user-role.enum";

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

  async create(userData: CreateUserDto): Promise<User> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<User> => {
      const existUser: User | undefined = await transactionalEntityManager.findOne(User,
        {
          where: { username: userData.username }
        });

      if (existUser) throw new BadRequestException(appError.USER_EXIST);

      const user: User = await transactionalEntityManager.save(User, {
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
    const data: User[] = items.map((item: User) => this.userProps(item));

    return data;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(appError.USER_NOT_FOUND);

    return this.userProps(user);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.findOne({ where: { username } });

    if (!user) throw new NotFoundException(appError.USER_NOT_FOUND);

    return user;
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<Partial<User>> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<Partial<User>> => {
      const user: User | undefined = await this.getUserById(id);
      const updatedFields: Partial<User> = {};

      for (const updateUserKey in updateUser) {
        if (updateUser[updateUserKey]) {
          updatedFields[updateUserKey] = updateUser[updateUserKey];
        }
      }

      if (updateUser.password) {
        updatedFields.password = await argon2.hash(updateUser.password);
      }

      const updateResult: UpdateResult = await transactionalEntityManager.update(User, id, updatedFields);

      return {
        username: updatedFields.username,
        password: updatedFields.password ? "Password updated successfully" : undefined,
        role: updatedFields.role
      };
    });
  }

  async removeUser(id: number): Promise<void> {
    return await this.entityManager.transaction(async (transactionalEntityManager: EntityManager): Promise<void> => {
      const removeResult: DeleteResult = await transactionalEntityManager.delete(User, id);
    });
  }
}