import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Posting } from "./posting.entity.typeorm";

@Entity()
export class Requirement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @Column({ type: "int" })
  quantity!: number;

  @ManyToOne(() => Posting, (posting) => posting.requirements)
  posting: Posting;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
