import { Requirement } from "../requirement/requirement.entity";
import { Role } from "../role/role.entity";
import { User } from "../user/user.entity";

export interface PostProps {
  author: User;
  date: Date;
  server: string;
  description?: string;
  requirements?: Requirement[];
  roles?: Role[];
}
