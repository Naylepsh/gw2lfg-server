import { EntityRepository } from "typeorm";
import { Requirement } from "../entities/requirement.entity";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IRequirementRepository extends IRepository<Requirement> {}

@EntityRepository(Requirement)
export class RequirementRepository
  extends GenericRepository<Requirement>
  implements IRepository<Requirement> {}
