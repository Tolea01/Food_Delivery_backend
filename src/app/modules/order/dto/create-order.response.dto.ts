import { Exclude, Expose } from 'class-transformer';
import {
  DeliveryMethod,
  PaymentMethod,
  Status,
} from '@modules/order/entities/order.enum';

@Expose()
export class CreateOrderResponseDto {
  id: number;
  number: string;
  created_at: Date;
  @Exclude()
  created_by: number;
  @Exclude()
  updated_at: Date;
  @Exclude()
  updated_by: number;
  @Exclude()
  deleted_at: Date;
  @Exclude()
  deleted_by: number;
  status: Status;
  total_product_price: number;
  courier_id: number;
  @Exclude()
  delivery_time: Date;
  delivery_method: DeliveryMethod;
  delivery_location_id: number;
  delivery_address: string;
  delivery_price: number;
  contact_phone: string;
  contact_email: string;
  paymentMethod: PaymentMethod;
  comments: string;
  join_code: string;
}
