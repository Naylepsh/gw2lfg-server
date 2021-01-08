import { Requirement } from "../../entities/requirement/requirement.entity";
import { IIdentifiableEntityRepository } from "../identifiable-entity.repository.interface";

export interface IRequirementRepository
  extends IIdentifiableEntityRepository<Requirement> {}
