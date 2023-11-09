import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateCustomerDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 50, { message: i18nValidationMessage('validation.MIN_MAX') })
  @ApiProperty({ example: 'customer name' })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(10, 250, { message: i18nValidationMessage('validation.MIN_MAX') })
  @ApiProperty({ example: 'customer address' })
  address: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(12, 12, { message: i18nValidationMessage('validation.MIN_MAX') })
  @ApiProperty({ example: 'customer phone number' })
  phone: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 100, { message: i18nValidationMessage('validation.MIN_MAX') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_PROPERTY') })
  @ApiProperty({ example: 'customer email address' })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  @ApiProperty({ example: 'customer location id' })
  location_id: number;
}
