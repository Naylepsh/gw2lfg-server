import { Requirement } from "../../entities/requirement/requirement.entity";

export interface IRequirementRepository {
  save(requirement: Requirement): Promise<Requirement>;
  save(requirement: Requirement[]): Promise<Requirement[]>;
  findOne(params: RequirementQueryParams): Promise<Requirement | undefined>;
  delete(criteria?: any): Promise<void>;
}

export interface RequirementQueryParams {
  where?: {
    id?: number;
  };
}
