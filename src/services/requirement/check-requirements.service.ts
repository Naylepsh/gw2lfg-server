import { Inject, Service } from "typedi";
import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { User } from "@root/data/entities/user/user.entity";
import {
  findUserItemsServiceType,
  requirementsCheckServiceType,
} from "@loaders/typedi.constants";
import { ICheckRequirementsService } from "./check-requirements.service.interface";
import { Item } from "./item";
import { FindUserItemsService } from "../user/find-user-items.service";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { ItemRequirement } from "@data/entities/item-requirement/item.requirement.entity";

/*
Service for checking whether given requirements are satisfied by given user.
*/
@Service(requirementsCheckServiceType)
export class CheckItemRequirementsService implements ICheckRequirementsService {
  constructor(
    @Inject(findUserItemsServiceType)
    private readonly findUserItemsService: FindUserItemsService
  ) {}

  async areRequirementsSatisfied(
    posts: RaidPost[],
    user: User
  ): Promise<boolean[]> {
    const userItems = await this.findUserItemsService.find({ id: user.id });

    const areItemRequirementsSatisfied = posts.map((post) =>
      this.areItemRequirementsSatisfied(post.requirements ?? [], userItems)
    );

    return areItemRequirementsSatisfied;
  }

  areItemRequirementsSatisfied(requirements: Requirement[], userItems: Item[]) {
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
