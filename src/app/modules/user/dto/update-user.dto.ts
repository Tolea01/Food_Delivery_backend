import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { UserRole } from "../entities/user-role.enum";
import { i18nValidationMessage } from "nestjs-i18n";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @Length(3, 50, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @ApiProperty({ required: false, example: "new username" })
  username?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @Length(6, 30, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @ApiProperty({ required: false, example: "new password" })
  password?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @IsEnum(UserRole, { message: i18nValidationMessage("validation.INVALID_USER_ENUM") })
  @Matches(/^(Admin|Courier|Customer)$/, { message: "User role is not valid" })
  @ApiProperty({ example: "Admin | Courier | Customer" })
  role?: UserRole;
}