import { User } from "@data/entities/user/user.entity";
import { Post } from "@data/entities/post/post.entity";

export interface ICheckRequirementsService {
  doesUserSatisfyPostsRequirements(posts: Post[], user: User): Promise<boolean[]>;
}
