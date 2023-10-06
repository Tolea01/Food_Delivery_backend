import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { createUniqueColumnOptions } from "src/app/helpers/column-helpers";
import { Region } from "../../region/entities/region.entity";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(100))
  name_en: string;

  @Column(createUniqueColumnOptions(100))
  name_ro: string;

  @Column(createUniqueColumnOptions(100))
  name_ru: string;

  @ManyToOne(() => Region, (region: Region) => region.location)
  @JoinColumn({name: 'region_id'})
  region: Region;
}