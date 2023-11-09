import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { createUniqueColumnOptions } from 'src/app/helpers/column-helpers';
import { Region } from '@region/entities/region.entity';
import { Customer } from '@app/modules/customer/entities/customer.entity';

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

  @ManyToOne(() => Region, (region: Region) => region.id)
  @JoinColumn({ name: 'region_id' })
  region_id: Region;

  @OneToMany(() => Customer, (customer: Customer) => customer.location_id)
  customers: Customer[];
}
