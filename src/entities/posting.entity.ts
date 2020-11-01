import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Requirement } from "./requirement.entity";
import { User } from "./user.entity";

export interface OptionalPostingParams {
  description: string;
  requirements: Requirement[];
}

@Entity()
export class Posting {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.postings)
  author: User;

  @Column()
  date: Date;

  @Column()
  server: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Requirement)
  @JoinTable()
  requirements: Requirement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    author: User,
    date: Date,
    server: string,
    optionalParams?: Partial<OptionalPostingParams>
  ) {
    this.author = author;
    this.date = date;
    this.server = server;

    if (optionalParams?.description)
      this.description = optionalParams.description;

    if (optionalParams?.requirements)
      this.requirements = optionalParams.requirements;
  }
}
