import { PartialType } from "@nestjs/mapped-types";
import { CreateProductCategoryDto } from "./create-product-category.dto";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @ApiProperty({ required: false, example: "new name_en" })
  name_en?: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @ApiProperty({ required: false, example: "new name_ro" })
  name_ro?: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @ApiProperty({ required: false, example: "new name_ru" })
  name_ru?: string;
}
