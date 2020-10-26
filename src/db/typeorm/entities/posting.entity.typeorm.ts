import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Requirement } from "./requirement.entity.typeorm";
import { User } from "./user.entity.typeorm";

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

  @OneToMany(() => Requirement, (requirement) => requirement.posting)
  requirements: Requirement[];

  @Column({ type: "int" })
  quantity!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
