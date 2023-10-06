import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { UserRole } from '../user-role.enum';
import { createUniqueColumnOptions } from 'src/app/helpers/column-helpers';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column(createUniqueColumnOptions(50))
  username: string

  @Column(createUniqueColumnOptions())
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Admin})
  role: UserRole;
}