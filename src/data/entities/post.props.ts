import { Requirement } from "./requirement.entity";
import { Role } from "./role.entity";
import { User } from "./user.entity";

export interface PostProps {
  author: User;
  date: Date;
  server: string;
  description?: string;
  requirements?: Requirement[];
  roles?: Role[];
}
