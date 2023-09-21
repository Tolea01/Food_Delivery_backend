import { IsNotEmpty, Length, } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required!' })
  @Length(3, 50, { message: 'Username must be between 3 and 50 characters!' })
  username: string;

  @IsNotEmpty({message: 'Password is required!'})
  @Length(6, 30, { message: 'Password must be between 6 and 30 characters!' })
  password: string;

  @IsNotEmpty()
  role: string;
}