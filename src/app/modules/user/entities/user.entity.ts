import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { UserRole } from './user-role.enum';
import { UniqueColumn } from 'src/app/helpers/column-helpers';
import { Product } from '@product/entities/product.entity';
import { Order } from '@app/modules/order/entities/order.entity';
import { Customer } from '@app/modules/customer/entities/customer.entity';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @UniqueColumn(50)
  username: string;

  @UniqueColumn()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Customer })
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
  couriers: Order[]; //todo ?
}
