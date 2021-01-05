import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { JoinRequestProps } from "./join-request.props";
import { Post } from "../post/post.entity";
import { Role } from "../role/role.entity";
import { User } from "../user/user.entity";

@Entity()
export class JoinRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Post)
  @JoinColumn()
  post: Post;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: JoinRequestProps) {
    if (props) {
      const { user, post, role } = props;
      if (!post.roles.map((role) => role.id).includes(role.id)) {
        throw new Error("Specified role does not belong to specified post");
      }
      this.user = user;
      this.post = post;
      this.role = role;
    }
  }
}
