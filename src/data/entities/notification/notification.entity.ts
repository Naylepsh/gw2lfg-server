import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { JoinRequest } from "../join-request/join-request.entity";
import { Post } from "../post/post.entity";
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
 * Notification to send to the recipent when an user sends a join request to recipent's group
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
export class YouSentRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `You've sent a join request to the post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}

/**
 * Notification to send to the recipent when an user accepts their join request to the user's group
 */
export class UserAcceptedRequestNotification extends Notification {
  constructor(request: JoinRequest, recipent: User) {
    const text = `User#${request.user.id} accepted your request to join their post#${request.post.id}`;
    super({ text, recipent: recipent.username });
  }
}

/**
 * Notification to send to the recipent when they accept a join request
 */
export class YouAcceptedRequestNotification extends Notification {
  constructor(request: JoinRequest, recipent: User) {
    const text = `You've accepted the request of user#${request.user.id} to join your post#${request.post.id}`;
    super({ text, recipent: recipent.username });
  }
}

/**
 * Notification to send to the recipent when they created a raid post
 */
export class YouCreatedRaidPostNotification extends Notification {
  constructor(post: Post, recipent: User) {
    const text = `You've created the post#${post.id}`;
    super({ text, recipent: recipent.username });
  }
}
