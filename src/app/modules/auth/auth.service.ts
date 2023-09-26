import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import appError from 'src/app/config/appError';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(payload: LoginDto): Promise<any> {
    const user = await this.userService.getUserByUsername(payload.username);

    if (user) {
      const passwordIsMatch = await argon2.verify(user.password, payload.password);

      if (passwordIsMatch) {
        const userData = { ...user }
        delete userData.password;
        return userData;
      }
    }

    throw new UnauthorizedException(appError.INCORRECT_LOGIN_DATA);
  }

  async login(data: LoginDto): Promise<string> {
    try {
      const user = await this.validateUser(data);
      return this.jwtService.sign({
        sub: user.id,
        id: user.id,
        username: user.username,
        role: user.role
      });
    } catch (e) {
      throw e;
    }
  }

  async registerUser(user: CreateUserDto): Promise<Partial<User>> {
    return await this.userService.create(user);
  }

  async getUserByToken(token: string): Promise<User> {
    const credentials = await this.jwtService.decode(token.replace('Bearer ', '')) as any;

    if (!credentials) throw new BadRequestException(appError.NO_CREDENTIALS);

    const { sub } = credentials;

    const user = await this.userService.getUserById(sub);

    if (!user) throw new NotFoundException(appError.USER_NOT_FOUND);

    return user;

  }
}
