import { Post } from "./post.entity";
import { Role } from "./role.entity";
import { User } from "./user.entity";

export interface JoinRequestProps {
  user: User;
  post: Post;
  role: Role;
}
