import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }
  async create(userData: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        username: userData.username
      },
    })
    if (existUser) throw new BadRequestException('This user already exist');

    const user = await this.userRepository.save({
      username: userData.username,
      password: await argon2.hash(userData.password),
    })

    return { user }
  }
}
