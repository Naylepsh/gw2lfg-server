import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { RequirementProps } from "./requirement.props";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Requirement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Post, (post) => post.requirements)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: RequirementProps) {
    if (props) {
      this.name = props.name;
    }
  }
}
