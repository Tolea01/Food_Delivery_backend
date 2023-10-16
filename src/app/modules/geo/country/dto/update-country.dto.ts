import { PartialType } from "@nestjs/mapped-types";
import { CreateCountryDto } from "./create-country.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
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