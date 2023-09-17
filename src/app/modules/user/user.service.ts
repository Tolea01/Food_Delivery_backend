import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  private async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async create(userData: CreateUserDto): Promise<{ message: string }> {
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

    return { message: "User created successfully." }
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();

    if (!users || users.length === 0) throw new NotFoundException('Users not found!');

    return users;
  }

  async getOneUser(id: number): Promise<User | undefined> {
    const user = await this.findUserById(id);

    return user;
  }

  async updateUser(id: number, updateUser: UpdateUserDto): Promise<{ message: string }> {
    const user = await this.findUserById(id);
    const updateResult = await this.userRepository.update(id, updateUser);

    return updateResult.affected > 0 ? { message: 'User updated successfully' } :
      { message: 'User not updated' };
  }

  async removeUser(id: number) {
    const user = await this.findUserById(id);
    const removeResult = await this.userRepository.delete(id);

    return removeResult.affected > 0 ? { message: 'User deleted successfully' } :
      { message: 'User not deleted' }
  }
}