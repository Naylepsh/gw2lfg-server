import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Posting } from "./posting.entity";

export interface RoleProps {
  name: string;
  description?: string;
  posting?: Posting;
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Posting, (posting) => posting.roles)
  posting: Posting;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: RoleProps) {
    if (props) {
      this.name = props.name;
      this.description = props.description;
      if (props.posting) this.posting = this.posting;
    }
  }
}
