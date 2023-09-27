import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ description: 'This route allows user authentication' })
  async login(@Body() data: LoginDto): Promise<string> {
    return this.authService.login(data);
  }

  @Post('register')
  @ApiOperation({ description: 'This route allows user registration' })
  async registerUser(@Body() data: CreateUserDto): Promise<Partial<User>> {
    return this.authService.registerUser(data);
  }
}