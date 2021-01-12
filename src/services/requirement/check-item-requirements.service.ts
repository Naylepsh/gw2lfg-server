import { Service } from "typedi";
import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import {
  ICheckItemRequirementsService,
  Item,
} from "./check-requirements.service.interface";
import { checkItemRequirementsServiceType } from "../../loaders/typedi.constants";

/*
Service for checking whether item requirements from given requirements are satisfied by given user.
*/
@Service(checkItemRequirementsServiceType)
export class CheckItemRequirementsService
  implements ICheckItemRequirementsService {
  async areRequirementsSatisfied(
    requirements: Requirement[],
    userItems: Item[]
  ) {
    // get items requirements
    const requiredItems = requirements.filter(
      (req) => req instanceof ItemRequirement
    ) as ItemRequirement[];

    // check whether user has enough items to satisfy the requirements
    let areAllRequirementsSatisfied = true;
    for (const requiredItem of requiredItems) {
      let isItemRequirementSatisfied = false;
      // check whether user has enough quantity of required item
      for (const userItem of userItems) {
        const isRequiredItem = userItem.name === requiredItem.name;
        const hasEnough = userItem.quantity >= requiredItem.quantity;
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
