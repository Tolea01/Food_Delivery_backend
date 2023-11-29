import {
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
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UpdateUserResponseDto } from '@user/dto/update-user.response.dto';
import { UserProps } from '@app/interfaces/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDto): Promise<UserItemDto> {
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
    filter?: any,
  ): Promise<Pagination<UserItemDto>> {
    try {
      const filtersBuilder: UserFiltersBuilder = new UserFiltersBuilder(filter);
      const queryBuilder: SelectQueryBuilder<User> = this.userRepository
        .createQueryBuilder('users')
        .where(filtersBuilder.get())
        .orderBy(sortColumn, sortOrder)
        .skip(page * limit)
        .take(limit);

      const result: Pagination<User, IPaginationMeta> = await paginate<User>(
        queryBuilder,
        { limit, page },
      );
      return {
        ...result,
        items: plainToClass(UserItemDto, result.items),
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserById(id: number): Promise<UserItemDto | undefined> {
    try {
      const user: User = await this.userRepository.findOneOrFail({ where: { id } });
      return plainToClass(UserItemDto, user);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getUserByUsername(username: string): Promise<UserProps | undefined> {
    try {
      return await this.userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updateUser(
    id: number,
    updateUser: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    try {
      await this.getUserById(id);

      if (updateUser.password) {
        updateUser.password = await argon2.hash(updateUser.password);
      }

      await this.userRepository.update(id, updateUser);

      return {
        ...updateUser,
        password: updateUser.password ? 'Password updated successfully' : undefined,
      };
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async removeUser(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
