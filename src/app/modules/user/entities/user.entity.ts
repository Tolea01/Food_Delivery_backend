import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { UserRole } from './user-role.enum';
import { createUniqueColumnOptions } from 'src/app/helpers/column-helpers';
import { Product } from '@products/entities/product.entity';
import { Order } from '@app/modules/orders/entities/order.entity';
import { Customer } from '@app/modules/customer/entities/customer.entity';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(50)) // todo decoractor name. See Nest custom decorators documentation
  username: string;

  @Column(createUniqueColumnOptions())
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Admin })//todo default admin?
  role: UserRole;

  @OneToMany(() => Product, (product: Product) => product.created_by)
  createdProducts: Product[];

  @OneToMany(() => Product, (product: Product) => product.updated_by)
  updatedProducts: Product[];

  @OneToMany(() => Product, (product: Product) => product.deleted_by)
  deletedProducts: Product[];

  @OneToMany(() => Customer, (customer: Customer) => customer.user_id)
  customers: Customer[];

  @OneToMany(() => Order, (order: Order) => order.created_by)
  createdOrders: Order[];

  @OneToMany(() => Order, (order: Order) => order.updated_by)
  updatedOrders: Order[];

  @OneToMany(() => Order, (order: Order) => order.deleted_by)
  deletedOrders: Order[];

  @OneToMany(() => Order, (order: Order) => order.courier_id)
  couriers: Order[];//todo ?
}
