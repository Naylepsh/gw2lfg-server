import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "../post/post.entity";
import { RoleProps } from "./role.props";

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
      if (props.id) this.id = props.id;
      this.name = props.name;
      this.description = props.description;
      this.class = props.class;
      if (props.post) this.post = props.post;
    }
  }
}
