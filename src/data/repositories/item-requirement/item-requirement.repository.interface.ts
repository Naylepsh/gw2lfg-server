import { ItemRequirement } from "../../entities/item-requirement/item.requirement.entity";

export interface IItemRequirementRepository {
  save(itemRequirement: ItemRequirement): Promise<ItemRequirement>;
  save(itemRequirements: ItemRequirement[]): Promise<ItemRequirement[]>;
  findOne(
    params: ItemRequirementQueryParams
  ): Promise<ItemRequirement | undefined>;
  delete(criteria?: any): Promise<void>;
}

export interface ItemRequirementQueryParams {
  where?: {
    id?: number;
  };
}
