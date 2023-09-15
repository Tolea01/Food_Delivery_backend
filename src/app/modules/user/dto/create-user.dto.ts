import { MinLength } from "class-validator";

export class CreateUserDto {
  username: string;

  @MinLength(6, { message: 'Password must be more 6 symbols'})
  password: string;
}