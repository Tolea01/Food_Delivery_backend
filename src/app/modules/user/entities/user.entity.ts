import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm";
import { UserRole } from "./user-role.enum";
import { createUniqueColumnOptions } from "src/app/helpers/column-helpers";
import { Product } from "../../products/entities/product.entity";

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(50))
  username: string;

  @Column(createUniqueColumnOptions())
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.Admin })
  role: UserRole;

  @OneToMany(() => Product, (product: Product) => product.created_by, { onDelete: "CASCADE" })
  createdProducts: Product[];

  @OneToMany(() => Product, (product: Product) => product.updated_by, { onDelete: "CASCADE" })
  updatedProducts: Product[];

  @OneToMany(() => Product, (product: Product) => product.deleted_by, { onDelete: "CASCADE" })
  deletedProducts: Product[];
}