import { IGW2Service } from "../../services/gw2service";

export interface IRequirement {
  getName(): string;
  isSatisfied(apiKey: string, gameService: IGW2Service): boolean;
}
