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

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ example: "new name_en (english language)", required: false })
  name_en?: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ example: "new name_ro (romanian language)", required: false })
  name_ro?: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ example: "new name_ru (russian language)", required: false })
  name_ru?: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  @ApiProperty({ example: "new product description (english language)", required: false })
  description_en?: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  @ApiProperty({ example: "new product description (romanian language)", required: false })
  description_ro?: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  @ApiProperty({ example: "new product description (russian language)", required: false })
  description_ru?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: "new photo", required: false })
  photo?: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: "2" })
  @ApiProperty({ example: "50,40 (type string)", required: false })
  price?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: "new category id", required: false })
  category_id?: number

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: "new type string date (2021-08-13)", required: false })
  updated_at?: Date;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: "new user id", required: false })
  updated_by?: number;
}