import { Posting } from "./posting";
import { User } from "./user.model";

export class GroupJoinRequest {
  author!: User;
  group!: Posting;
}
