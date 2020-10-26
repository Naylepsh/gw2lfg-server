import { IGW2Service } from "../../services/gw2service";
import { InvalidRequirementQuantity } from "./requirement.errors";
import { IRequirement } from "./requirement.interface";

export class LIRequirement implements IRequirement {
  public static readonly itemName = "Legendary Insight";
  quantity: number;

  constructor(quantity: number) {
    if (quantity < 0) throw new InvalidRequirementQuantity();

    this.quantity = quantity;
  }

  isSatisfied(apiKey: string, gameService: IGW2Service) {
    const item = gameService.getItem(this.getName(), apiKey);
    return item.quantity >= this.quantity;
  }

  getName() {
    return LIRequirement.itemName;
  }
}

// export class TitleRequirement implements IRequirement {
//   name: string;

//   isSatisfied(_: string) {
//     return true
//   }
// }
