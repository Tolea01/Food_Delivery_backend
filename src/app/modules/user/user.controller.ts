import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Patch,
  Delete
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser)
  }

  @Get('listUsers')
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.getOneUser(Number(id))
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.updateUser(Number(id), updateUser)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(Number(id))
  }
}
