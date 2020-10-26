import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RaidPosting } from "./raid-posting.entitity";

@Entity()
export class RaidBoss {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @Column()
  cm!: boolean;

  @ManyToMany(() => RaidPosting, (posting) => posting.bosses)
  postings: RaidPosting[];
}
