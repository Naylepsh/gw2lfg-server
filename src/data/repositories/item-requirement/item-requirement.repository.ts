import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { ItemRequirement } from "../../entities/item-requirement/item.requirement.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { IItemRequirementRepository } from "./item-requirement.repository.interface";

@Service()
@EntityRepository(ItemRequirement)
export class ItemRequirementRepository
  extends IdentifiableEntityRepository<ItemRequirement>
  implements IItemRequirementRepository {}
