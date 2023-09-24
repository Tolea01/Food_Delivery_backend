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
  ParseIntPipe
} from '@nestjs/common';

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
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Get()
  getByUsername(@Query('username') username: string) {
    return this.userService.getUserByUsername(username);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUser: UpdateUserDto) {
    return this.userService.updateUser(id, updateUser);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
}