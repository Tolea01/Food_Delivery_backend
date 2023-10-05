import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import paginationConfig from "src/app/config/pagination";
import { User } from "./user.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

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
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post("register")
  @ApiOperation({ description: "This route allows the creation/registration of a user" })
  async create(@Body() createUser: CreateUserDto): Promise<Partial<User>> {
    return await this.userService.create(createUser);
  }

  @Get("list")
  @ApiOperation({ description: "This route returns a list of all users, or users specified by parameters" })
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
  @ApiOperation({ description: "This route returns a user by id" })
  async getOne(@Param("id", ParseIntPipe) id: number): Promise<User | undefined> {
    return await this.userService.getUserById(id);
  }

  @Patch(":id")
  @ApiOperation({ description: "This route allows updating a field by id" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateUser: UpdateUserDto): Promise<Partial<User>> {
    return await this.userService.updateUser(id, updateUser);
  }

  @Delete(":id")
  @ApiOperation({ description: "This route deletes a user by id" })
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.userService.removeUser(id);
  }
}