import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { createUniqueColumnOptions } from "../../../helpers/column-helpers";
import { ProductCategory } from "../../product-categories/entities/product-category.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(100))
  name_en: string;

  @Column(createUniqueColumnOptions(100))
  name_ro: string;

  @Column(createUniqueColumnOptions(100))
  name_ru: string;

  @Column(createUniqueColumnOptions(100))
  description_en: string;

  @Column(createUniqueColumnOptions(100))
  description_ro: string;

  @Column(createUniqueColumnOptions(100))
  description_ru: string;

  @Column(createUniqueColumnOptions(100))
  photo: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
    nullable: false
  })
  price: number;

  @ManyToOne(() => ProductCategory, (productCategory: ProductCategory) => productCategory.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category_id: ProductCategory;

  @Column({
    type: "timestamp",
    default: (): string => "CURRENT_TIMESTAMP(6)",
    precision: 6
  })
  created_at: Date;

  @ManyToOne(() => User, (user: User) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "created_by" })
  created_by: User;

  @Column({
    type: "timestamp",
    default: (): string => "CURRENT_TIMESTAMP(6)",
    precision: 6,
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updated_at: Date;

  @ManyToOne(() => User, (user: User) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "updated_by" })
  updated_by: User;

  @Column({ type: "timestamp", default: null })
  deleted_at: Date;

  @ManyToOne(() => User, (user: User) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "deleted_by" })
  deleted_by: User;
}
