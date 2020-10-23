import { IGW2Service } from "../services/gw2service";

export interface IRequirement {
  isSatisfied(apiKey: string, gameService: IGW2Service): boolean;
}

export class InvalidRequirementQuantity extends Error {}

export class LIRequirement implements IRequirement {
  // cannot name it 'name', due to Function.name being a thing
  public static readonly itemName = "Legendary Insight";
  quantity: number;

  constructor(quantity: number) {
    if (quantity < 0) throw new InvalidRequirementQuantity();

    this.quantity = quantity;
  }

  isSatisfied(apiKey: string, gameService: IGW2Service) {
    const item = gameService.getItem(LIRequirement.itemName, apiKey);
    return item.quantity >= this.quantity;
  }
}

// export class TitleRequirement implements IRequirement {
//   name: string;

//   isSatisfied(_: string) {
//     return true
//   }
// }
