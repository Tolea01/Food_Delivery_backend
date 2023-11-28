import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { User } from '@user/entities/user.entity';
import appError from 'src/app/config/appError';
import { UserData, UserProps } from '@app/interfaces/interfaces';
import { UserItemDto } from '@user/dto/user.item.dto';
import handleExceptionError from '@helpers/handle-exception-error';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: LoginDto): Promise<UserProps> {
    try {
      const user: UserProps = await this.userService.getUserByUsername(payload.username);

      if (user) {
        const passwordIsMatch: boolean = await argon2.verify(
          user.password,
          payload.password,
        );

        if (passwordIsMatch) {
          const userData: any = { ...user };
          delete userData.password;
          return userData;
        }
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async login(data: LoginDto): Promise<string> {
    try {
      const user: UserData = await this.validateUser(data);
      return this.jwtService.sign({
        sub: user.id,
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async registerUser(user: CreateUserDto): Promise<UserItemDto> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      handleExceptionError(error);
    }
  }

  async getUserByToken(token: string): Promise<UserItemDto> {
    try {
      const credentials = (await this.jwtService.decode(
        token.replace('Bearer ', ''),
      )) as any;

      if (!credentials) {
        throw new BadRequestException(appError.NO_CREDENTIALS);
      }

      const { sub } = credentials;

      const user: UserItemDto = await this.userService.getUserById(sub);

      if (!user) {
        throw new NotFoundException(appError.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      handleExceptionError(error);
    }
  }
}
