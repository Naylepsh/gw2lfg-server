import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { JoinRequest } from "../join-request/join-request.entity";
import { User } from "../user/user.entity";
import { NotificationProps } from "./notification.props";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recipent: string;

  @Column()
  text: string;

  @Column({ default: false })
  seen: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: NotificationProps) {
    if (props) {
      if (props.id) this.id = props.id;
      this.recipent = props.recipent;
      this.text = props.text;
      this.seen = props.seen || false;
    }
  }
}

/**
 * Notification to send to the recipent when an user sends a join request
 */
export class UserWantsToJoinNotification extends Notification {
  constructor(request: JoinRequest, recipent: User) {
    const text = `User#${request.user.id} wants to join your post#${request.post.id}`;
    super({ text, recipent: recipent.username });
  }
}

/**
 * Notification to send to the recipent when they send a join request
 */
export class UserSentRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `You've sent a join request to the post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}
