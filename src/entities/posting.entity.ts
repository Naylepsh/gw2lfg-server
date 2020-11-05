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
export interface PostingProps {
  author: User;
  date: Date;
  server: string;
  description: string | undefined;
  requirements: Requirement[] | undefined;
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
  description?: string;

  @ManyToMany(() => Requirement)
  @JoinTable()
  requirements: Requirement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: PostingProps) {
    if (props) {
      this.author = props.author;
      this.date = props.date;
      this.server = props.server;
      this.description = props.description;
      this.requirements = props.requirements ?? [];
    }
  }
}
