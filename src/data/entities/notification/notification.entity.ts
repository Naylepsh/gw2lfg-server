import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NotificationProps } from "./notification.props";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  recipentId: string;

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
      this.recipentId = props.recipentId;
      this.text = props.text;
      this.seen = props.seen || false;
    }
  }
}
