import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UniqueColumn } from '@app/helpers/column-helpers';
import { Location } from '@app/modules/geo/location/entities/location.entity';
import { User } from '@app/modules/user/entities/user.entity';
import { Order } from '@app/modules/order/entities/order.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @UniqueColumn(100)
  name: string;

  @UniqueColumn(250)
  address: string;

  @UniqueColumn(12)
  phone: string;

  @UniqueColumn(100)
  email: string;

  @ManyToOne(() => Location, (location: Location) => location.id, { nullable: false })
  @JoinColumn({ name: 'location_id' })
  location_id: number;

  @ManyToOne(() => User, (user: User) => user.id, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @OneToMany(() => Order, (order: Order) => order.customer_id)
  orders: Order[];
}
