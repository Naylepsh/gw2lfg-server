import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { ItemRequirement } from "../../entities/item-requirement/item.requirement.entity";
import {
  IItemRequirementRepository,
  ItemRequirementQueryParams,
} from "./item-requirement.repository.interface";

@Service()
@EntityRepository(ItemRequirement)
export class ItemRequirementRepository
  extends AbstractRepository<ItemRequirement>
  implements IItemRequirementRepository {
  save(itemRequirement: ItemRequirement): Promise<ItemRequirement>;
  save(itemRequirements: ItemRequirement[]): Promise<ItemRequirement[]>;
  save(
    data: ItemRequirement | ItemRequirement[]
  ): Promise<ItemRequirement | ItemRequirement[]> {
    if (Array.isArray(data)) {
      return this.repository.save(data);
    }
    return this.repository.save(data);
  }

  findOne(
    params: ItemRequirementQueryParams
  ): Promise<ItemRequirement | undefined> {
    return this.repository.findOne(params);
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }
}
