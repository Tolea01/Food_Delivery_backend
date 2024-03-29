import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UniqueColumn } from 'src/app/helpers/column-helpers';
import { Region } from '@region/entities/region.entity';
import { Customer } from '@app/modules/customer/entities/customer.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @UniqueColumn(100)
  name_en: string;

  @UniqueColumn(100)
  name_ro: string;

  @UniqueColumn(100)
  name_ru: string;

  @ManyToOne(() => Region, (region: Region) => region.id)
  @JoinColumn({ name: 'region_id' })
  region_id: number;

  @OneToMany(() => Customer, (customer: Customer) => customer.location_id)
  customers: Customer[];
}
