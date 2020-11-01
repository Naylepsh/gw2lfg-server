import { IGW2APIService } from "../../services/gw2-api/gw2.service.interface";
import { InvalidRequirementQuantity } from "./requirement.errors";
import { IRequirement } from "./requirement.interface";

export class LIRequirement implements IRequirement {
  public static readonly itemName = "Legendary Insight";
  quantity: number;

  constructor(quantity: number) {
    if (quantity < 0) throw new InvalidRequirementQuantity();

    this.quantity = quantity;
  }

  isSatisfied(apiKey: string, gameService: IGW2APIService) {
    const item = gameService.getItem(this.getName(), apiKey);
    return item.count >= this.quantity;
  }

  getName() {
    return LIRequirement.itemName;
  }

  getQuantity(): number {
    return this.quantity;
  }
}

// export class TitleRequirement implements IRequirement {
//   name: string;

//   isSatisfied(_: string) {
//     return true
//   }
// }
