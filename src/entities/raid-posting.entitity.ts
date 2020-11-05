import { Entity, JoinTable, ManyToMany } from "typeorm";
import { Posting, PostingProps } from "./posting.entity";
import { RaidBoss } from "./raid-boss.entity";

export interface RaidPostingProps extends PostingProps {
  bosses?: RaidBoss[];
}

@Entity()
export class RaidPosting extends Posting {
  @ManyToMany(() => RaidBoss)
  @JoinTable()
  bosses?: RaidBoss[];

  constructor(props?: RaidPostingProps) {
    super(props);
    this.bosses = props?.bosses;
  }
}
