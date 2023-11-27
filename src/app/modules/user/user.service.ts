import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import appError from 'src/app/config/appError';
import { UserItemDto } from '@user/dto/user.item.dto';
import { plainToClass } from 'class-transformer';
import handleExceptionError from '@helpers/handle-exception-error';
import { SortOrder } from '@database/validators/typeorm.sort.validator';
import { UserSort } from '@user/validators/user.sort.validator';
import UserFiltersBuilder from '@user/builders/user.filters.builder';
import { paginate } from 'nestjs-typeorm-paginate';
import { UserRole } from '@user/entities/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private userProps(user: User): User {
    //todo use DTO
    return {
      ...user,
      password: undefined,
    };
  }

  async create(userData: CreateUserDto): Promise<UserItemDto> {
    //todo UserCreatePayloadDTO and UserCreateResponseDTO
    try {
      const existUser: User | undefined = await this.userRepository.findOne({
        where: { username: userData.username },
      });

      if (existUser) {
        throw new ConflictException(appError.USER_EXIST);
      }

      const user: CreateUserDto = await this.userRepository.save({
        ...userData,
        password: await argon2.hash(userData.password),
      });

      return plainToClass(UserItemDto, user);
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async getAllUsers(
    limit?: number,
    page?: number,
    sortOrder?: SortOrder,
    sortColumn?: UserSort,
    username?: string,
    role?: UserRole,
    // filter?: any,
  ): Promise<any> {
    try {
      // const filtersBuilder: UserFiltersBuilder = new UserFiltersBuilder(filter);
      // const queryBuilder: SelectQueryBuilder<User> = this.userRepository
      //   .createQueryBuilder('users')
      //   .where(filtersBuilder.get())
      //   .orderBy(sortColumn, sortOrder)
      //   .skip(page * limit)
      //   .take(limit);
      //
      // return await paginate<User>(queryBuilder, { limit, page });

      const queryBuilder: SelectQueryBuilder<User> = this.userRepository
        .createQueryBuilder('user')
        .where(username ? 'user.username = :username' : '1=1', { username })
        .andWhere(role ? 'user.role = :role' : '1=1', { role })
        .orderBy(sortColumn, sortOrder)
        .skip((page - 1) * limit)
        .take(limit);
      // return plainToClass(UserItemDto, await queryBuilder.getMany());
      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserById(id: number): Promise<User | undefined> {
    //todo response dto
    try {
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    //todo response dto
    try {
      return await this.userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<Partial<User>> {
    try {
      const existingUser = await this.getUserById(id);

      if (updateUser.password) {
        updateUser.password = await argon2.hash(updateUser.password);
      }

      await this.userRepository.update(id, updateUser);

      return {
        ...updateUser,
        password: updateUser.password ? 'Password updated successfully' : undefined,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  async removeUser(id: number): Promise<void> {
    try {
      const deleteResult = await this.userRepository.delete(id);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
