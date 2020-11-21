import { EntityRepository } from "typeorm";
import { Requirement } from "../entities/requirement.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IIdentifiableEntityRepository } from "./repository.interface";

export interface IRequirementRepository
  extends IIdentifiableEntityRepository<Requirement> {}

@EntityRepository(Requirement)
export class RequirementRepository
  extends IdentifiableEntityRepository<Requirement>
  implements IRequirementRepository {}
