import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength
} from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "new name_en (english language)", required: false })
  name_en?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "new name_ro (romanian language)", required: false })
  name_ro?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "new name_ru (russian language)", required: false })
  name_ru?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "new product description (english language)", required: false })
  description_en?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "new product description (romanian language)", required: false })
  description_ro?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ example: "new product description (russian language)", required: false })
  description_ru?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @MaxLength(100, { message: i18nValidationMessage("validation.MAX") })
  @ApiProperty({ example: "new photo", required: false })
  photo?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsDecimal({ decimal_digits: "2" }, { message: i18nValidationMessage("validation.INVALID_DECIMAL") })
  @ApiProperty({ example: "50,40 (type string)", required: false })
  price?: number;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsNumber({}, { message: i18nValidationMessage("validation.INVALID_NUMBER") })
  @ApiProperty({ example: "new category id", required: false })
  category_id?: number;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsDateString({}, {message: i18nValidationMessage("validation.INVALID_DATE_STRING")})
  @ApiProperty({ example: "new type string date (2021-08-13)", required: false })
  updated_at?: Date;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsNumber({}, { message: i18nValidationMessage("validation.INVALID_NUMBER") })
  @ApiProperty({ example: "new user id", required: false })
  updated_by?: number;
}