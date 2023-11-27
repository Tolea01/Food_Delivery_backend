import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { DeliveryMethod, PaymentMethod } from '../entities/order.enum';

export class CreateOrderDto {
  @ApiProperty({ example: 'Order Number', description: 'Order number' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  number: string;

  created_by: number;

  @ApiProperty({ example: 0, description: 'Total products price' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsDecimal({}, { message: i18nValidationMessage('validation.INVALID_DECIMAL') })
  total_products_price: number;

  @ApiProperty({ example: 'Courier', description: 'Delivery method' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(DeliveryMethod, {
    message: i18nValidationMessage('validation.INVALID_DELIVERY_METHOD'),
  })
  delivery_method: string;

  @ApiProperty({ example: 250, description: 'Delivery price' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsDecimal({}, { message: i18nValidationMessage('validation.INVALID_DECIMAL') })
  delivery_price: number;

  @ApiProperty({ example: '123456', description: 'Contact phone' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(12, { message: i18nValidationMessage('validation.MAX') })
  contact_phone: string;

  @ApiProperty({ example: 'user@example.com', description: 'Contact email' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  contact_email: string;

  @ApiProperty({ example: 'ABC123', description: 'Join code' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(6, { message: i18nValidationMessage('validation.MAX') })
  join_code: string;

  @ApiProperty({ example: 1, description: 'Delivery location ID' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  delivery_location_id: number;

  @ApiProperty({ example: '123 Main St, City', description: 'Delivery address' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(250, { message: i18nValidationMessage('validation.MAX') })
  delivery_address: string;

  @ApiProperty({ example: 'CourierCash', description: 'Payment method' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(PaymentMethod, {
    message: i18nValidationMessage('validation.INVALID_PAYMENT_METHOD'),
  })
  payment_method: string;

  @ApiProperty({ example: 'Order Comments', description: 'Order comments' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(250, { message: i18nValidationMessage('validation.MAX') })
  comments: string;
}
