import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Status, DeliveryMethod, PaymentMethod } from '../entities/order.enum';
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ example: 'Order Number', description: 'Order number' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  number?: string;

  @ApiProperty({ example: 'New', description: 'Order status' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(Status, { message: i18nValidationMessage('validation.INVALID_STATUS') })
  status?: string;

  @ApiProperty({ example: 0, description: 'Total products price' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  total_products_price?: number;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  customer_id?: number;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  courier_id?: number;

  @ApiProperty({ example: 'Courier', description: 'Delivery method' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(DeliveryMethod, {
    message: i18nValidationMessage('validation.INVALID_DELIVERY_METHOD'),
  })
  delivery_method?: string;

  @ApiProperty({ example: 250, description: 'Delivery price' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  delivery_price?: number;

  @ApiProperty({ example: '123456', description: 'Contact phone' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(12, { message: i18nValidationMessage('validation.MAX') })
  contact_phone?: string;

  @ApiProperty({ example: 'user@example.com', description: 'Contact email' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  contact_email?: string;

  @ApiProperty({ example: 'ABC123', description: 'Join code' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(6, { message: i18nValidationMessage('validation.MAX') })
  join_code?: string;

  @ApiProperty({ example: '2023-01-01T12:00:00Z', description: 'Delivery time' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  delivery_time?: Date;

  @ApiProperty({ example: 1, description: 'Delivery location ID' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  delivery_location_id?: number;

  @ApiProperty({ example: '123 Main St, City', description: 'Delivery address' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(250, { message: i18nValidationMessage('validation.MAX') })
  delivery_address?: string;

  @ApiProperty({ example: 'CourierCash', description: 'Payment method' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(PaymentMethod, {
    message: i18nValidationMessage('validation.INVALID_PAYMENT_METHOD'),
  })
  payment_method?: string;

  @ApiProperty({ example: 'Order Comments', description: 'Order comments' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @MaxLength(250, { message: i18nValidationMessage('validation.MAX') })
  comments?: string;

  updated_by?: number;
  updated_at?: Date;
}
