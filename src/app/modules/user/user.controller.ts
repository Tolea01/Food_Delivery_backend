import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import paginationConfig from 'src/app/config/config.pagination';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Get('list')
  getAll(
    @Query('page') page: number = paginationConfig.page,
    @Query('itemsPerPage') itemsPerPage: number = paginationConfig.itemsPerPage,
    @Query('sort') sort: string | undefined
  ) {
    return this.userService.getAllUsers(page, itemsPerPage, sort);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.getUserById(Number(id));
  }

  @Get()
  getByUsername(@Query('username') username: string) {
    return this.userService.getUserByUsername(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.updateUser(Number(id), updateUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(Number(id));
  }
}