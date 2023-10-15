import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { UserRole } from "../entities/user-role.enum";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(3, 50, { message: "Username must be between 3 and 50 characters!" })
  @ApiProperty({ required: false, example: "new username" })
  username?: string;

  @IsString()
  @Length(6, 30, { message: "Password must be between 6 and 30 characters!" })
  @ApiProperty({ required: false, example: "new password" })
  password?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({example: 'Admin | Courier | Customer'})
  role?: UserRole;
}