import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Posting } from "./posting.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  apiKey!: string;

  @OneToMany(() => Posting, (posting) => posting.author)
  postings: Posting[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(username: string, password: string, apiKey: string) {
    this.username = username;
    this.password = password;
    this.apiKey = apiKey;
  }
}