import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UniqueColumn } from 'src/app/helpers/column-helpers';
import { Region } from '@region/entities/region.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @UniqueColumn(100)
  name_en: string;

  @UniqueColumn(100)
  name_ro: string;

  @UniqueColumn(100)
  name_ru: string;

  @OneToMany(() => Region, (region: Region) => region.country_id)
  regions: Region[];
}
