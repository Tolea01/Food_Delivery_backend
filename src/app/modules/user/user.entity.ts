import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({length: 50})
  username: string

  @Column()
  password: string

  @Column({default: 'admin', length: 8})
  role: string
}