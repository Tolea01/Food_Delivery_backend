import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';

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

    throw new UnauthorizedException('Username or password is incorrect!');
  }

  async login(data: LoginDto): Promise<string> {
    try {
      const user = await this.validateUser(data);
      return this.jwtService.sign({
        sub: user.id,
        id: user.id,
        username: user.username,
      });
    } catch (e) {
      throw e;
    }
  }

  async registerUser(user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }

  async getUserByToken(token: string) {
    const credentials = await this.jwtService.decode(token.replace('Bearer ', '')) as any;

    if (!credentials) throw new BadRequestException('No credentials!');

    const { sub } = credentials;

    const user = await this.userService.getUserById(sub);

    if (!user) throw new NotFoundException('User not found!');

    return user;

  }
}
