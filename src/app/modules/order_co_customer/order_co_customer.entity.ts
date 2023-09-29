import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { createUniqueColumnOptions } from "src/app/helpers/column-helpers";

@Entity()
export class OrderCoCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(100))
  name: string
}