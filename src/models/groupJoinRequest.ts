import { Posting } from "./postings/posting.model";
import { User } from "./user.model";

export class GroupJoinRequest {
  author!: User;
  group!: Posting;
}
