import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateCustomerDto {
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @Length(3, 30, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @ApiProperty({ example: "customer name" })
  name: string;
}