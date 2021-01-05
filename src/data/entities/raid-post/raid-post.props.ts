import { PostProps } from "../post/post.props";
import { RaidBoss } from "../raid-boss/raid-boss.entity";

export interface RaidPostProps extends PostProps {
  bosses: RaidBoss[];
}
