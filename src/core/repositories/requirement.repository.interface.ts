import { Requirement } from "../entities/requirement.entity";
import { IIdentifiableEntityRepository } from "./repository.interface";

export interface IRequirementRepository
  extends IIdentifiableEntityRepository<Requirement> {}
