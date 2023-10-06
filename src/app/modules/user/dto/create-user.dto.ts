import { IsNotEmpty, Length, } from "class-validator";
import { UserRole } from "../entities/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required!' })
  @Length(3, 50, { message: 'Username must be between 3 and 50 characters!' })
  @ApiProperty({example: 'username'})
  username: string;

  @IsNotEmpty({message: 'Password is required!'})
  @Length(6, 30, { message: 'Password must be between 6 and 30 characters!' })
  @ApiProperty({example: 'password'})
  password: string;

  @IsNotEmpty()
  @ApiProperty({example: 'Admin | Courier | Customer'})
  role: UserRole;
}