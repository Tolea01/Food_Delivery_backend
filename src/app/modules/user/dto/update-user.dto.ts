import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { UserRole } from "../entities/user-role.enum";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(3, 50)
  @ApiProperty({ required: false, example: "new username" })
  username?: string;

  @IsString()
  @Length(6, 30)
  @ApiProperty({ required: false, example: "new password" })
  password?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(Admin|Courier|Customer)$/, { message: "User role is not valid" })
  @ApiProperty({example: 'Admin | Courier | Customer'})
  role?: UserRole;
}