import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateProductDto {
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "name_en (english language)" })
  name_en: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "name_ro (romanian language)" })
  name_ro: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "name_ru (russian language)" })
  name_ru: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "product description (english language)" })
  description_en: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "product description (romanian language)" })
  description_ro: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "product description (russian language)" })
  description_ru: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @MaxLength(100, { message: i18nValidationMessage("validation.MAX") })
  @ApiProperty({ example: "photo" })
  photo: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsDecimal({ decimal_digits: "2" }, { message: i18nValidationMessage("validation.INVALID_DECIMAL") })
  @ApiProperty({ example: "50.40 (type string)" })
  price: number;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsNumber({}, { message: i18nValidationMessage("validation.INVALID_NUMBER") })
  @ApiProperty({ example: "category id" })
  category_id: number;
}
