import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

export interface JoinRequestProps {
  userId: number;
  postId: number;
}

@Entity()
export class JoinRequest {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: JoinRequestProps) {
    if (props) {
      this.userId = props.userId;
      this.postId = props.postId;
    }
  }
}

// entity() RaidJoinRequest ...
