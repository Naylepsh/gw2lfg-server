import { ItemRequirement } from "../../entities/item-requirement/item.requirement.entity";
import { IIdentifiableEntityRepository } from "../identifiable-entity.repository.interface";

export interface IItemRequirementRepository
  extends IIdentifiableEntityRepository<ItemRequirement> {}
