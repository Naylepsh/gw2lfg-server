import { IPosition } from "../positions/position.interface";
import { IRequirement } from "../requirements/requirement.interface";
import { User } from "../user.model";
import { Posting } from "./posting.model";

export interface RaidBoss {
  name: string;
  cm: boolean;
}

export class RaidPosting extends Posting {
  constructor(
    id: number,
    author: User,
    date: Date,
    server: string,
    description: string,
    requirements: IRequirement[],
    positions: IPosition[],
    public bosses: RaidBoss[]
  ) {
    super(id, author, date, server, description, requirements, positions);
  }

  public static fromPosting(posting: Posting, bosses: RaidBoss[]) {
    return new this(
      posting.id,
      posting.author,
      posting.date,
      posting.server,
      posting.description,
      posting.requirements,
      posting.positions,
      bosses
    );
  }

  public equals(raidPosting: RaidPosting) {
    return this.id === raidPosting.id;
  }
}
