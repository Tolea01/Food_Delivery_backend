import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { createUniqueColumnOptions } from "../../../helpers/column-helpers";

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
}
