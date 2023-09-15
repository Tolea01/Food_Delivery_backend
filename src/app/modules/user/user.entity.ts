import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 50})
  username: string

  @Column({length: 64})
  password: string

  @Column({default: 'admin', length: 8})
  role: string
}