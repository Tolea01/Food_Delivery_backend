import { PartialType } from "@nestjs/mapped-types";
import { CreateProductCategoryDto } from "./create-product-category.dto";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { i18nValidationMessage } from "nestjs-i18n";

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ required: false, example: "new name_en" })
  name_en?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ required: false, example: "new name_ro" })
  name_ro?: string;

  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.INVALID_STRING") })
  @Length(3, 100, { message: i18nValidationMessage("validation.MIN_MAX") })
  @ApiProperty({ required: false, example: "new name_ru" })
  name_ru?: string;
}
