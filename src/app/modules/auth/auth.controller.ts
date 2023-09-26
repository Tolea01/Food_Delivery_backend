import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() data: LoginDto): Promise<string> {
    return this.authService.login(data);
  }

  @Post('register')
  async registerUser(@Body() data: CreateUserDto): Promise<Partial<User>> {
    return this.authService.registerUser(data);
  }
}