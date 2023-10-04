import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { createUniqueColumnOptions } from "src/app/helpers/column-helpers";
import { Region } from "../region/region.entity";

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(100))
  name_en: string;

  @Column(createUniqueColumnOptions(100))
  name_ro: string;

  @Column(createUniqueColumnOptions(100))
  name_ru: string;

  @OneToMany(() => Region, (region: Region) => region.country)
  region: Region[];
}