import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./post.entity";

export interface RoleProps {
  name: string;
  class: string;
  description?: string;
  post?: Post;
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  class: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Post, (post) => post.roles)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: RoleProps) {
    if (props) {
      this.name = props.name;
      this.description = props.description;
      this.class = props.class;
      if (props.post) this.post = props.post;
    }
  }
}
