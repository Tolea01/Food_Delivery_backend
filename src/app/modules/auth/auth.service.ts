import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
    const passwordIsMatch = await argon2.verify(user.password, password);
    if (user && passwordIsMatch) return user;

    throw new UnauthorizedException('Username or password is incorrect!');
  }

  async login(user: Record<string, string>) {
    const { id, username } = user;
    return {
      id,
      username,
      token: this.jwtService.sign({ id: user.id, username: user.username })
    };
  }
}
