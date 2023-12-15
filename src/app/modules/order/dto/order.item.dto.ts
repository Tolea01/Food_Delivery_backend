import { Expose } from 'class-transformer';
import {
  DeliveryMethod,
  PaymentMethod,
  Status,
} from '@modules/order/entities/order.enum';

@Expose()
export class OrderItemDto {
  id: number;
  number: string;
  created_at: Date;
  created_by: number;
  updated_at: Date;
  updated_by: number;
  deleted_at: Date;
  deleted_by: number;
  status: Status;
  total_product_price: number;
  customer_id: number;
  courier_id: number;
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
