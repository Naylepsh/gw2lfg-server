import { Post } from "../post/post.entity";

export interface RoleProps {
  name: string;
  class: string;
  description?: string;
  post?: Post;
}
