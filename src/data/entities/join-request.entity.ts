import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { JoinRequestProps } from "./join-request.props";

@Entity()
export class JoinRequest {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @PrimaryColumn()
  roleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: JoinRequestProps) {
    if (props) {
      this.userId = props.userId;
      this.postId = props.postId;
      this.roleId = props.roleId;
    }
  }
}

// entity() RaidJoinRequest ...
