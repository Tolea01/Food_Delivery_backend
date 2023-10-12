import { PartialType } from "@nestjs/mapped-types";
import { CreateLocationDto } from "./create-location.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @ApiProperty({ required: false, example: "new name_en" })
  name_en?: string;

  @ApiProperty({ required: false, example: "new name_ro" })
  name_ro?: string;

  @ApiProperty({ required: false, example: "new name_ru" })
  name_ru?: string;

  @ApiProperty({ required: false, example: "new region id" })
  region_id?: number;
}