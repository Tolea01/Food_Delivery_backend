import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
  @Unique(['username'])
  export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 50, nullable: false })
    username: string

    @Column({nullable: false})
    password: string

    @Column({ length: 8, nullable: false })
    role: string
  }