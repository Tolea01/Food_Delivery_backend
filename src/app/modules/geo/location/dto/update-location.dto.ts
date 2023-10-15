import { PartialType } from "@nestjs/mapped-types";
import { CreateLocationDto } from "./create-location.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @IsString()
  @Length(3, 100)
  @ApiProperty({ required: false, example: "new name_en" })
  name_en?: string;

  @IsString()
  @Length(3, 100)
  @ApiProperty({ required: false, example: "new name_ro" })
  name_ro?: string;

  @IsString()
  @Length(3, 100)
  @ApiProperty({ required: false, example: "new name_ru" })
  name_ru?: string;

  @IsNumber()
  @ApiProperty({ required: false, example: "new region id" })
  region_id?: number;
}