import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Requirement } from "./requirement.entity";
import { User } from "./user.entity";

@Entity()
export class Posting {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.postings)
  author!: User;

  @Column()
  date: Date;

  @Column()
  server: string;

  @Column()
  description: string;

  @ManyToMany(() => Requirement, (requirement) => requirement.postings)
  requirements: Requirement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
