import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export interface JoinRequestProps {
  userId: number;
  postId: number;
  roleId: number;
}

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
