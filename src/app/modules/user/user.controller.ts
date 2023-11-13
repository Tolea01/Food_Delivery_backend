import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import paginationConfig from 'src/app/config/pagination';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageHeader } from '@app/helpers/language-header';
import { ParamsApiOperation } from '@app/helpers/params-api-operation';
import { QueryApiOperation } from '@app/helpers/query-api-operation';
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
  DefaultValuePipe,
} from '@nestjs/common';

@ApiTags('User CRUD')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  // todo swagger documentation
  @LanguageHeader()
  @ApiOperation({ summary: 'User registration' })
  async create(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.userService.create(createUser);
  }

  @Get('list')
  @ParamsApiOperation('users')
  @QueryApiOperation('itemsPerPage')
  @QueryApiOperation('page')
  @QueryApiOperation('sortOrder')
  @QueryApiOperation('sortColumn')
  // todo response swagger documentation
  async getAll(
    @Query(
      'itemsPerPage',//todo rename
      new DefaultValuePipe(paginationConfig.itemsPerPage),
      ParseIntPipe,
    )
    itemsPerPage: number,
    @Query('page', new DefaultValuePipe(paginationConfig.page), ParseIntPipe)
    page: number,
    @Query('sortOrder', new DefaultValuePipe(paginationConfig.sortOrder))
    sortOrder: string,
    @Query('sortColumn', new DefaultValuePipe(paginationConfig.sortColumn))
    sortColumn: string,
  ): Promise<Partial<User[]>> {
    const pagination = { itemsPerPage, page, sortOrder, sortColumn };

    return await this.userService.getAllUsers(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<User | undefined> {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update user by id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUserDto,
  ): Promise<Partial<User>> {
    return await this.userService.updateUser(id, updateUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userService.removeUser(id);
  }
}
