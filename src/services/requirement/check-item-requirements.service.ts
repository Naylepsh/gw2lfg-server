import { Inject, Service } from "typedi";
import { User } from "@data/entities/user/user.entity";
import {
  findUserItemsServiceType,
  requirementsCheckServiceType,
} from "@loaders/typedi.constants";
import { ICheckRequirementsService } from "./check-requirements.service.interface";
import { Item } from "./item";
import { FindUserItemsService } from "../user/find-user-items.service";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { ItemRequirement } from "@data/entities/item-requirement/item.requirement.entity";

/**
 * Service for checking whether given requirements are satisfied by given user.
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

    const areItemRequirementsSatisfied = posts.map((post) => {
      const itemRequirements = (post.requirements ?? []).filter(
        (req) => req instanceof ItemRequirement
      ) as ItemRequirement[];
      return this.areItemRequirementsSatisfied(itemRequirements, userItems);
    });

    return areItemRequirementsSatisfied;
  }

  areItemRequirementsSatisfied(
    requirements: ItemRequirement[],
    userItems: Item[]
  ) {
    return requirements.every((item) =>
      this.inventoryContainsEnoughQuantityOfItem(userItems, item)
    );
  }

  private inventoryContainsEnoughQuantityOfItem(inventory: Item[], item: Item) {
    for (const itemInInventory of inventory) {
      const isRequiredItem = itemInInventory.name === item.name;
      const hasEnough = itemInInventory.quantity >= item.quantity;
      if (isRequiredItem && hasEnough) {
        return true;
      }
    }

    return false;
  }
}
