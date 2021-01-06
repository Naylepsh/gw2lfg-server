import { Service } from "typedi";
import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import { User } from "@root/data/entities/user/user.entity";
import { ItemsFetcher } from "../gw2-api/items/get-items.gw2-api.service";
import { nameToId } from "../gw2-items/gw2-items.service";
import { ICheckRequirementsService } from "./check-requirements.service.interface";

@Service()
export class CheckItemRequirementsService implements ICheckRequirementsService {
  constructor(private readonly getItems: ItemsFetcher) {}

  async areRequirementsSatisfied(requirements: Requirement[], user: User) {
    const requiredItems = requirements.filter(
      (req) => req instanceof ItemRequirement
    ) as ItemRequirement[];
    const requiredItemsIds = requiredItems.map((item) => nameToId(item.name));

    const userItems = await this.getItems.fetch(requiredItemsIds, user.apiKey);

    let areAllRequirementsSatisfied = true;
    for (const requiredItem of requiredItems) {
      let isItemRequirementSatisfied = false;
      for (const userItem of userItems) {
        const isRequiredItem = userItem.id === nameToId(requiredItem.name);
        const hasEnough = userItem.count >= requiredItem.quantity;
        if (isRequiredItem && hasEnough) {
          isItemRequirementSatisfied = true;
          break;
        }
      }

      if (!isItemRequirementSatisfied) {
        areAllRequirementsSatisfied = false;
        break;
      }
    }

    return areAllRequirementsSatisfied;
  }
}
