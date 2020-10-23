import { Posting } from "./posting";
import { User } from "./user";

export class GroupJoinRequest {
  author!: User;
  group!: Posting;
}
