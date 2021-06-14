import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
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
 * Notification to send to the recipent when they created a raid post
 */
export class YouCreatedRaidPostNotification extends Notification {
  constructor(post: Post, recipent: User) {
    const text = `You've created the post#${post.id}`;
    super({ text, recipent: recipent.username });
  }
}
