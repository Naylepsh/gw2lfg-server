import { FindOperator } from "typeorm";
import { Requirement } from "../../entities/requirement/requirement.entity";

export interface IRequirementRepository {
  save(requirement: Requirement): Promise<Requirement>;
  save(requirement: Requirement[]): Promise<Requirement[]>;
  findOne(params: RequirementQueryParams): Promise<Requirement | undefined>;
  delete(params: RequirementQueryParams): Promise<void>;
}

export interface RequirementQueryParams {
  where?: {
    id?: number | FindOperator<number>;
    post?: {
      id: number | FindOperator<number>;
    };
  };
}
