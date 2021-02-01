import { ItemRequirement } from "../../data/entities/item-requirement/item.requirement.entity";
import { IItemRequirementRepository } from "../../data/repositories/item-requirement/item-requirement.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class ItemRequirementMemoryRepository
  extends IdentifiableMemoryRepository<ItemRequirement>
  implements IItemRequirementRepository {}
