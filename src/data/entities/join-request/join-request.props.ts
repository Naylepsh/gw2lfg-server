import { Post } from "../post/post.entity";
import { Role } from "../role/role.entity";
import { User } from "../user/user.entity";

export interface JoinRequestProps {
  user: User;
  post: Post;
  role: Role;
}
