import { IGW2APIService } from "../../services/gw2-api/gw2.service.interface";

export interface IRequirement {
  getName(): string;
  getQuantity(): number;
  isSatisfied(apiKey: string, gameService: IGW2APIService): boolean;
}
