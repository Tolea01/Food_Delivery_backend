import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { createUniqueColumnOptions } from '@helpers/column-helpers';
import { Product } from '@products/entities/product.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(100))
  name_en: string;

  @Column(createUniqueColumnOptions(100))
  name_ro: string;

  @Column(createUniqueColumnOptions(100))
  name_ru: string;

  @OneToMany(() => Product, (product: Product) => product.category_id)
  products: Product[];
}
