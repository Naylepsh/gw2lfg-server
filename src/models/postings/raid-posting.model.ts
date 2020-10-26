import { Posting } from "./posting.model";

export interface RaidBoss {
  name: string;
  cm: boolean;
}

export class RaidPosting extends Posting {
  bosses: RaidBoss[];
}
