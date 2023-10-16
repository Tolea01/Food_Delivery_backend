import { IsNotEmpty, IsString, Length } from "class-validator";
import { UserRole } from "../entities/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 50)
  @IsString()
  @ApiProperty({example: 'username'})
  username: string;

  @IsNotEmpty()
  @Length(6, 30)
  @IsString()
  @ApiProperty({example: 'password'})
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({example: 'Admin | Courier | Customer'})
  role: UserRole;
}