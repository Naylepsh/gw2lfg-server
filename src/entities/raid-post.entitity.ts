import { Entity, JoinTable, ManyToMany } from "typeorm";
import { Post, PostProps } from "./post.entity";
import { RaidBoss } from "./raid-boss.entity";

export class NoBossesProvided extends Error {}

export interface RaidPostProps extends PostProps {
  bosses: RaidBoss[];
}

@Entity()
export class RaidPost extends Post {
  @ManyToMany(() => RaidBoss)
  @JoinTable()
  bosses: RaidBoss[];

  constructor(props?: RaidPostProps) {
    if (props) {
      if (!props.bosses) throw new NoBossesProvided();

      super(props);
      this.bosses = props.bosses;
    } else {
      super();
    }
  }
}
