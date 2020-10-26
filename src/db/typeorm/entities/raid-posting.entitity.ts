import { Entity, ManyToMany } from "typeorm";
import { Posting } from "./posting.entity";
import { RaidBoss } from "./raid-boss.entity";

@Entity()
export class RaidPosting extends Posting {
  @ManyToMany(() => RaidBoss, (boss) => boss.postings)
  bosses: RaidBoss[];
}
