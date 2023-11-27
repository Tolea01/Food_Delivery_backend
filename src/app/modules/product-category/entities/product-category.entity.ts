import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UniqueColumn } from '@helpers/column-helpers';
import { Product } from '@product/entities/product.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @UniqueColumn(100)
  name_en: string;

  @UniqueColumn(100)
  name_ro: string;

  @UniqueColumn(100)
  name_ru: string;

  @OneToMany(() => Product, (product: Product) => product.category_id)
  products: Product[];
}
