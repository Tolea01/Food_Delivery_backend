import { PartialType } from "@nestjs/mapped-types";
import { CreateRegionDto } from "./create-region.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @ApiProperty({ required: false, example: "new name_en" })
  name_en?: string;

  @ApiProperty({ required: false, example: "new name_ro" })
  name_ro?: string;

  @ApiProperty({ required: false, example: "new name_ru" })
  name_ru?: string;

  @ApiProperty({ required: false, example: "new country id" })
  country_id?: number;
}