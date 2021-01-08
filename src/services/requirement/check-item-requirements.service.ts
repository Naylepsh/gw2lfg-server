import { Service } from "typedi";
import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import { User } from "@root/data/entities/user/user.entity";
import { ItemsFetcher } from "../gw2-api/items/get-items.gw2-api.service";
import { nameToId } from "../gw2-items/gw2-items.service";
import { ICheckRequirementsService } from "./check-requirements.service.interface";

/*
Service for checking whether item requirements from given requirements are satisfied by given user.
*/
@Service()
export class CheckItemRequirementsService implements ICheckRequirementsService {
  constructor(private readonly getItems: ItemsFetcher) {}

  async areRequirementsSatisfied(requirements: Requirement[], user: User) {
    // get items requirements
    const requiredItems = requirements.filter(
      (req) => req instanceof ItemRequirement
    ) as ItemRequirement[];
    const requiredItemsIds = requiredItems.map((item) => nameToId(item.name));

    // fetch user items
    const userItems = await this.getItems.fetch(requiredItemsIds, user.apiKey);

    // check whether user has enough items to satisfy the requirements
    let areAllRequirementsSatisfied = true;
    for (const requiredItem of requiredItems) {
      let isItemRequirementSatisfied = false;
      // check whether user has enough quantity of required item
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
