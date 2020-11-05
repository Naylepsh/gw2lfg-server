import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Posting } from "./posting.entity";

export interface UserProps {
  username: string;
  password: string;
  apiKey: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  apiKey: string;

  @OneToMany(() => Posting, (posting) => posting.author)
  postings: Posting[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: UserProps) {
    if (props) {
      this.username = props.username;
      this.password = props.password;
      this.apiKey = props.apiKey;
    }
  }
}
