import { IRequirement } from "./requirement";
import { User } from "./user.model";

export type Server = "EU" | "NA";

export class Posting {
  id: number;
  author!: User;
  date!: Date;
  server!: Server;
  description: string;
  requirements: IRequirement[];

  constructor(
    author: User,
    date: Date,
    server: Server,
    description: string,
    requirements: IRequirement[]
  ) {
    this.author = author;
    this.date = date;
    this.server = server;
    this.description = description;
    this.requirements = requirements;
  }
}

export interface RaidBoss {
  name: string;
  cm: boolean;
}

export class RaidPosting extends Posting {
  bosses: RaidBoss[];
}
