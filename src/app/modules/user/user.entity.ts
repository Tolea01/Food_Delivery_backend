import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { UserRole } from './user-role.enum';
@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 50, nullable: false })
  username: string

  @Column({ nullable: false })
  password: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Admin})
  role: UserRole;
}