import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import paginationConfig from 'src/app/config/pagination';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  Req,
} from '@nestjs/common';
import { UserItemDto } from '@user/dto/user.item.dto';
import { Request } from 'express';
import { SortOrder } from '@database/validators/typeorm.sort.validator';
import { UserSort } from '@user/validators/user.sort.validator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateUserResponseDto } from '@user/dto/update-user.response.dto';

@ApiTags('User CRUD')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @LanguageHeader()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async create(@Body() createUser: CreateUserDto): Promise<UserItemDto> {
    return await this.userService.create(createUser);
  }

  @Get('list')
  @ParamsApiOperation('users')
  @QueryApiOperation('limit', 'items per page', 'number')
  @QueryApiOperation('page', 'page number', 'number')
  @QueryApiOperation('sortOrder', 'sort order', 'enum')
  @QueryApiOperation('sortColumn', 'sort column', 'enum')
  @ApiResponse({ status: 200, description: 'Return a list of users' })
  @ApiResponse({ status: 500, description: 'Error when searching for parameters' })
  async getAll(
    @Query('limit', new DefaultValuePipe(paginationConfig.limit), ParseIntPipe)
    limit: number,
    @Query('page', new DefaultValuePipe(paginationConfig.page), ParseIntPipe)
    page: number,
    @Query('sortOrder', new DefaultValuePipe(paginationConfig.sortOrder))
    sortOrder: SortOrder,
    @Query('sortColumn', new DefaultValuePipe(paginationConfig.sortColumn))
    sortColumn: UserSort,
    @Req() request: Request,
  ): Promise<Pagination<UserItemDto>> {
    return await this.userService.getAllUsers(
      limit,
      page,
      sortOrder,
      sortColumn,
      request.query.filter,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'The user has been found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<UserItemDto | undefined> {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  @LanguageHeader()
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'The user has been updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    return await this.userService.updateUser(id, updateUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'The user has been deleted' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.userService.removeUser(id);
  }
}
