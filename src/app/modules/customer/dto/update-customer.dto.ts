import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from '@app/modules/geo/location/entities/location.entity';
import { CreateCustomerDto } from '@app/modules/order-co-customer/dto/create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 50, { message: i18nValidationMessage('validation.MIN_MAX') })
  @ApiProperty({ example: 'customer name' })
  @IsOptional()
  name?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(10, 250, { message: i18nValidationMessage('validation.MIN_MAX') })
  @ApiProperty({ example: 'customer address' })
  @IsOptional()
  address?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(12, 12, { message: i18nValidationMessage('validation.MIN_MAX') })
  @ApiProperty({ example: 'customer phone number' })
  @IsOptional()
  phone?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 100, { message: i18nValidationMessage('validation.MIN_MAX') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_PROPERTY') })
  @ApiProperty({ example: 'customer email address' })
  @IsOptional()
  email?: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  @ApiProperty({ example: 'customer location id' })
  @IsOptional()
  location_id?: number;
}
