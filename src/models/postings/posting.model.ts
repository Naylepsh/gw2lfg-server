import { IPosition } from "../positions/position.interface";
import { IRequirement } from "../requirements/requirement.interface";
import { User } from "../user.model";

export type Server = "EU" | "NA";

export class Posting {
  id: number;
  author!: User;
  date!: Date;
  server!: Server;
  description: string;
  requirements: IRequirement[];
  positions: IPosition[];

  constructor(
    author: User,
    date: Date,
    server: Server,
    description: string,
    requirements: IRequirement[],
    positions: IPosition[]
  ) {
    this.author = author;
    this.date = date;
    this.server = server;
    this.description = description;
    this.requirements = requirements;
    this.positions = positions;
  }
}
