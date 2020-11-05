import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Requirement } from "./requirement.entity";
import { Role } from "./role.entity";
import { User } from "./user.entity";

export interface PostingProps {
  author: User;
  date: Date;
  server: string;
  description?: string;
  requirements?: Requirement[];
  roles?: Role[];
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

  @OneToMany(() => Role, (role) => role.posting)
  roles: Role[];

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
      this.roles = props.roles ?? [];
    }
  }
}
