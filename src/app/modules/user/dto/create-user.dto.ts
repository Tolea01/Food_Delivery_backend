import { IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { UserRole } from "../entities/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @Length(3, 50, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @ApiProperty({ example: "username" })
  username: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @Length(6, 30, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @ApiProperty({ example: "password" })
  password: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @IsEnum(UserRole, { message: i18nValidationMessage("validation.INVALID_USER_ENUM") })
  @ApiProperty({ example: "Admin | Courier | Customer" })
  role: UserRole;
}