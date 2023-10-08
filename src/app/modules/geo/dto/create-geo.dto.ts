import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateGeoDto {
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
}