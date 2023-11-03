import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString,
  Length,
  MaxLength
} from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { Product } from "../entities/product.entity";
import { ProductCategory } from "../../product-categories/entities/product-category.entity";

export class UpdateProductDto extends PartialType(Product) {
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsOptional()
  @ApiProperty({ example: "new name_en (english language)", required: false })
  name_en?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsOptional()
  @ApiProperty({ example: "new name_ro (romanian language)", required: false })
  name_ro?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsOptional()
  @ApiProperty({ example: "new name_ru (russian language)", required: false })
  name_ru?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsOptional()
  @ApiProperty({ example: "new product description (english language)", required: false })
  description_en?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsOptional()
  @ApiProperty({ example: "new product description (romanian language)", required: false })
  description_ro?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(5, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @IsOptional()
  @ApiProperty({ example: "new product description (russian language)", required: false })
  description_ru?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @MaxLength(100, { message: i18nValidationMessage("validation.MAX") })
  @IsOptional()
  @ApiProperty({ example: "new photo", required: false })
  photo?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsDecimal({ decimal_digits: "2" }, { message: i18nValidationMessage("validation.INVALID_DECIMAL") })
  @IsOptional()
  @ApiProperty({ example: "50,40 (type string)", required: false })
  price?: number;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsNumber({}, { message: i18nValidationMessage("validation.INVALID_NUMBER") })
  @IsOptional()
  @ApiProperty({ example: "new category id", required: false })
  category_id?: ProductCategory;
}