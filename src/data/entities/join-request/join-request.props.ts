import { Post } from "../post/post.entity";
import { Role } from "../role/role.entity";
import { User } from "../user/user.entity";
import { JoinRequestStatus } from "./join-request.status";

export interface JoinRequestProps {
  user: User;
  post: Post;
  role: Role;
  status?: JoinRequestStatus;
}
