import { Post } from "../post/post.entity";

export interface RoleProps {
  id?: number;
  name: string;
  class: string;
  description?: string;
  post?: Post;
}
