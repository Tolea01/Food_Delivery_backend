import { PartialType } from "@nestjs/mapped-types";
import { CreateRegionDto } from "./create-region.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ required: false, example: "new name_en" })
  name_en?: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ required: false, example: "new name_ro" })
  name_ro?: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @ApiProperty({ required: false, example: "new name_ru" })
  name_ru?: string;

  @IsNumber()
  @ApiProperty({ required: false, example: "new country id" })
  country_id?: number;
}