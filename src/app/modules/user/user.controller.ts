import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import paginationConfig from "src/app/config/pagination";
import { User } from "./entities/user.entity";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

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
} from "@nestjs/common";

@ApiTags("User CRUD")
@ApiBearerAuth()
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post("register")
  @ApiOperation({
    summary: "User registration",
    description: "This route allows the creation/registration of a user"
  })
  async create(@Body() createUser: CreateUserDto): Promise<User> {
    return await this.userService.create(createUser);
  }

  @Get("list")
  @ApiOperation({
    summary: "Get users by params",
    description: "This route returns a list of all users, or users specified by parameters"
  })
  @ApiQuery({ name: "itemsPerPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "sortOrder", required: false })
  @ApiQuery({ name: "sortColumn", required: false })
  async getAll(
    @Query(
      "itemsPerPage",
      new DefaultValuePipe(paginationConfig.itemsPerPage),
      ParseIntPipe
    )
      itemsPerPage: number,
    @Query(
      "page",
      new DefaultValuePipe(paginationConfig.page),
      ParseIntPipe
    ) page: number,
    @Query(
      "sortOrder",
      new DefaultValuePipe(paginationConfig.sortOrder)
    ) sortOrder: string,
    @Query(
      "sortColumn",
      new DefaultValuePipe(paginationConfig.sortColumn)
    ) sortColumn: string
  ): Promise<Partial<User[]>> {
    const pagination = { itemsPerPage, page, sortOrder, sortColumn };

    return await this.userService.getAllUsers(pagination);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get user by id",
    description: "This route returns a user by id"
  })
  async getOne(@Param("id", ParseIntPipe) id: number): Promise<User | undefined> {
    return await this.userService.getUserById(id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update user by id",
    description: "This route allows updating a field by id"
  })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateUser: UpdateUserDto): Promise<Partial<User>> {
    return await this.userService.updateUser(id, updateUser);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete user by id",
    description: "This route deletes a user by id"
  })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.userService.removeUser(id);
  }
}