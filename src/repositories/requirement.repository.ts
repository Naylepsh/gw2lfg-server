import { EntityRepository } from "typeorm";
import { Requirement } from "../entities/requirement.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IRequirementRepository extends IRepository<Requirement> {}

@EntityRepository(Requirement)
export class RequirementRepository
  extends IdentifiableEntityRepository<Requirement>
  implements IRepository<Requirement> {}
