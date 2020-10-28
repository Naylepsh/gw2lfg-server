import { IPosition } from "../positions/position.interface";
import { IRequirement } from "../requirements/requirement.interface";
import { User } from "../user.model";

export type Server = "EU" | "NA";

export class Posting {
  constructor(
    protected readonly id: number,
    public author: User,
    public date: Date,
    public server: Server,
    public description: string,
    public requirements: IRequirement[],
    public positions: IPosition[]
  ) {}

  public equals(posting: Posting) {
    return this.id === posting.id;
  }
}
