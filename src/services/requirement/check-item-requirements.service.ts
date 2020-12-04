import { Service } from "typedi";
import {
  ItemRequirement,
  Requirement,
} from "../../data/entities/requirement.entity";
import { User } from "../../data/entities/user.entity";
import { ConcreteItemsFetcher } from "../gw2-api/gw2-api.service";
import { nameToId } from "../gw2-items/gw2-items.service";
import { ICheckRequirementsService } from "./check-requirements.service.interface";

@Service()
export class CheckItemRequirementsService implements ICheckRequirementsService {
  constructor(private readonly getItems: ConcreteItemsFetcher) {}

  async areRequirementsSatisfied(requirements: Requirement[], user: User) {
    const requiredItems = requirements.filter(
      (req) => req instanceof ItemRequirement
    ) as ItemRequirement[];
    const requiredItemsIds = requiredItems.map((item) => nameToId(item.name));

    const userItems = await this.getItems.fetch(requiredItemsIds, user.apiKey);

    let areSatisfied = true;
    for (const userItem of userItems) {
      for (const requiredItem of requiredItems) {
        if (userItem.id === nameToId(requiredItem.name)) {
          if (userItem.count < requiredItem.quantity) {
            areSatisfied = false;
          }
        }
      }
    }
    return areSatisfied;
  }
}
