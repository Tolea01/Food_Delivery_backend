import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { createUniqueColumnOptions } from "src/app/helpers/column-helpers";
import { Country } from "../../country/entities/country.entity";
import { Location } from "../../location/entities/location.entity";


@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(100))
  name_en: string;

  @Column(createUniqueColumnOptions(100))
  name_ro: string;

  @Column(createUniqueColumnOptions(100))
  name_ru: string;

  @ManyToOne(() => Country, (country: Country) => country.id)
  @JoinColumn({ name: "country_id" })
  country_id: Country;

  @OneToMany(() => Location, (location: Location) => location.region_id, { onDelete: "CASCADE" })
  locations: Location[];
}