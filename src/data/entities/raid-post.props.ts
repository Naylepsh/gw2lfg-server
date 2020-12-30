import { PostProps } from "./post.props";
import { RaidBoss } from "./raid-boss.entity";

export interface RaidPostProps extends PostProps {
  bosses: RaidBoss[];
}
