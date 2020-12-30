import { Post } from "./post.entity";

export interface RoleProps {
  name: string;
  class: string;
  description?: string;
  post?: Post;
}
