import { ChildEntity, JoinTable, ManyToMany } from "typeorm";
import { Post } from "./post.entity";
import { RaidBoss } from "./raid-boss.entity";
import { RaidPostProps } from "./raid-post.props";

@ChildEntity()
export class RaidPost extends Post {
  @ManyToMany(() => RaidBoss)
  @JoinTable()
  bosses: RaidBoss[];

  constructor(props?: RaidPostProps) {
    if (props) {
      super(props);
      this.bosses = props.bosses;
    } else {
      super();
    }
  }
}
