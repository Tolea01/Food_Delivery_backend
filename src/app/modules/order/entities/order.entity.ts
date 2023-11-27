import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@app/modules/user/entities/user.entity';
import { Location } from '@app/modules/geo/location/entities/location.entity';
import { Customer } from '@app/modules/customer/entities/customer.entity';
import { Status, DeliveryMethod, PaymentMethod } from './order.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 12 })
  number: string;

  @Column({
    type: 'timestamp',
    default: (): string => 'CURRENT_TIMESTAMP(6)',
    precision: 6,
  })
  created_at: Date;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({
    type: 'timestamp',
    default: null,
  })
  updated_at: Date;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'updated_by' })
  updated_by: number;

  @Column({
    type: 'timestamp',
    default: null,
  })
  deleted_at: Date;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.New,
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_products_price: number;

  @ManyToOne(() => Customer, (customer: Customer) => customer.id)
  @JoinColumn({ name: 'customer_id' })
  customer_id: number;

  @ManyToOne(() => User, (courier: User) => courier.id)
  @JoinColumn({ name: 'courier_id' })
  courier_id: number;

  @Column({ type: 'timestamp', default: null })
  delivery_time: Date;

  @Column({
    type: 'enum',
    enum: DeliveryMethod,
    default: DeliveryMethod.Self,
  })
  delivery_method: string;

  @ManyToOne(() => Location, (location: Location) => location.id)
  @JoinColumn({ name: 'delivery_location_id' })
  delivery_location_id: number;

  @Column({ type: 'varchar', length: 250, unique: true })
  delivery_address: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivery_price: number;

  @Column({ type: 'varchar', length: 12, unique: true })
  contact_phone: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  contact_email: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CourierCash,
  })
  payment_method: string;//todo type PaymentMethod

  @Column({ type: 'varchar', length: 250 })
  comments: string;

  @Column({ type: 'varchar', length: 6 })
  join_code: string;
}
