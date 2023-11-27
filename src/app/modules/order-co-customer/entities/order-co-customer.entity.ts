import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UniqueColumn } from 'src/app/helpers/column-helpers';

@Entity()
export class OrderCoCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @UniqueColumn(100)
  name: string;
}
