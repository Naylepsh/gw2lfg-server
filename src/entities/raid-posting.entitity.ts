import { Entity, JoinTable, ManyToMany } from "typeorm";
import { Posting } from "./posting.entity";
import { RaidBoss } from "./raid-boss.entity";
import { OptionalPostingParams } from "./posting.entity";
import { User } from "./user.entity";

export interface OptionalRaidPostingParams extends OptionalPostingParams {
  bosses: RaidBoss[];
}

@Entity()
export class RaidPosting extends Posting {
  @ManyToMany(() => RaidBoss)
  @JoinTable()
  bosses: RaidBoss[];

  constructor(
    author: User,
    date: Date,
    server: string,
    optionalParams?: Partial<OptionalRaidPostingParams>
  ) {
    super(author, date, server, optionalParams);

    if (optionalParams?.bosses) this.bosses = optionalParams.bosses;
  }
}
