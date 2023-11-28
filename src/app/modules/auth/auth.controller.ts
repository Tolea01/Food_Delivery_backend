import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { User } from '@user/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LanguageHeader } from '@app/helpers/language-header';
import { UserItemDto } from '@user/dto/user.item.dto';

@ApiBearerAuth()
@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @LanguageHeader()
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'User is not registered' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiOperation({ summary: 'User login' })
  async login(@Body() data: LoginDto): Promise<string> {
    return await this.authService.login(data);
  }

  @Post('register')
  @LanguageHeader()
  @ApiResponse({ status: 201, description: 'The user has been successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiOperation({ summary: 'User registration' })
  async registerUser(@Body() data: CreateUserDto): Promise<UserItemDto> {
    return await this.authService.registerUser(data);
  }
}
