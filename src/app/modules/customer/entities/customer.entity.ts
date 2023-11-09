import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { createUniqueColumnOptions } from '@app/helpers/column-helpers';
import { Location } from '@app/modules/geo/location/entities/location.entity';
import { User } from '@app/modules/user/entities/user.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(createUniqueColumnOptions(100))
  name: string;

  @Column(createUniqueColumnOptions(250))
  address: string;

  @Column(createUniqueColumnOptions(12))
  phone: string;

  @Column(createUniqueColumnOptions(100))
  email: string;

  @ManyToOne(() => Location, (location: Location) => location.id, { nullable: false })
  @JoinColumn({ name: 'location_id' })
  location_id: Location;

  @ManyToOne(() => User, (user: User) => user.id, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user_id: User;
}
