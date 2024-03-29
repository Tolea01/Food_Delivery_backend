import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Country } from '@country/entities/country.entity';
import { CreateRegionDto } from './create-region.dto';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 100, { message: i18nValidationMessage('validation.MIN_MAX') })
  @IsOptional()
  @ApiProperty({ required: false, example: 'new name_en' })
  name_en?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 100, { message: i18nValidationMessage('validation.MIN_MAX') })
  @IsOptional()
  @ApiProperty({ required: false, example: 'new name_ro' })
  name_ro?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 100, { message: i18nValidationMessage('validation.MIN_MAX') })
  @IsOptional()
  @ApiProperty({ required: false, example: 'new name_ru' })
  name_ru?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  @IsOptional()
  @ApiProperty({ required: false, example: 'new country id' })
  country_id?: number;
}
