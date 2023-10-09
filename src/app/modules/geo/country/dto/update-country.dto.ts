import { PartialType } from "@nestjs/mapped-types";
import { CreateCountryDto } from "./create-country.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @ApiProperty({ required: false, example: "new name_en" })
  name_en?: string;

  @ApiProperty({ required: false, example: "new name_ro" })
  name_ro?: string;

  @ApiProperty({ required: false, example: "new name_ru" })
  name_ru?: string;
}