import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UniqueColumn } from 'src/app/helpers/column-helpers';
import { Country } from '@country/entities/country.entity';
import { Location } from '@location/entities/location.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @UniqueColumn(100)
  name_en: string;

  @UniqueColumn(100)
  name_ro: string;

  @UniqueColumn(100)
  name_ru: string;

  @ManyToOne(() => Country, (country: Country) => country.id)
  @JoinColumn({ name: 'country_id' })
  country_id: number;

  @OneToMany(() => Location, (location: Location) => location.region_id)
  locations: Location[];
}
