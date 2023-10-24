import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ example: "name_en (english language)" })
  name_en: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ example: "name_ro (romanian language)" })
  name_ro: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ example: "name_ru (russian language)" })
  name_ru: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  @ApiProperty({ example: "product description (english language)" })
  description_en: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  @ApiProperty({ example: "product description (romanian language)" })
  description_ro: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  @ApiProperty({ example: "product description (russian language)" })
  description_ru: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: "photo" })
  photo: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: "2" })
  @ApiProperty({ example: "50.40 (type string)" })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: "category id" })
  category_id: number;

  // @IsNotEmpty()
  // @IsDateString()
  // @ApiProperty({ example: "date type string (2021-08-13)" })
  // created_at: Date;
  //
  // @IsNotEmpty()
  // @IsNumber()
  // @ApiProperty({ example: "user id" })
  // created_by: number;
}
