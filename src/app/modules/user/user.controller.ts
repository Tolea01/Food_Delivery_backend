import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import paginationConfig from 'src/app/config/pagination';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { User } from './user.entity';
import { UserListItemDTO } from './dto/user-list-item.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.userService.create(createUser);
  }

  @Get('list')
  async getAll(
    @Query(
      'itemsPerPage',
      new DefaultValuePipe(paginationConfig.itemsPerPage),
      ParseIntPipe
    )
    itemsPerPage: number,
    @Query(
      'page',
      new DefaultValuePipe(paginationConfig.page),
      ParseIntPipe
    ) page: number,
    @Query(
      'sortOrder',
      new DefaultValuePipe(paginationConfig.sortOrder),
    ) sortOrder: string,
    @Query(
      'sortColumn',
      new DefaultValuePipe(paginationConfig.sortColumn),
    ) sortColumn: string,
  ): Promise<UserListItemDTO[]> {
    const pagination = { itemsPerPage, page, sortOrder, sortColumn };

    return await this.userService.getAllUsers(pagination);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<User | undefined> {
    return await this.userService.getUserById(id);
  }

  @Get()
  async getByUsername(@Query('username') username: string): Promise<User | undefined> {
    return await this.userService.getUserByUsername(username);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUser: UpdateUserDto): Promise<Partial<User>> {
    return await this.userService.updateUser(id, updateUser);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userService.removeUser(id);
  }
}