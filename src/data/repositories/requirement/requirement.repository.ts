import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { Requirement } from "../../entities/requirement/requirement.entity";
import {
  IRequirementRepository,
  RequirementQueryParams,
} from "./requirement.repository.interface";

@Service()
@EntityRepository(Requirement)
export class RequirementRepository
  extends AbstractRepository<Requirement>
  implements IRequirementRepository {
  save(requirement: Requirement): Promise<Requirement>;
  save(requirements: Requirement[]): Promise<Requirement[]>;
  save(
    data: Requirement | Requirement[]
  ): Promise<Requirement | Requirement[]> {
    if (Array.isArray(data)) {
      return this.repository.save(data);
    }
    return this.repository.save(data);
  }

  findOne(params: RequirementQueryParams): Promise<Requirement | undefined> {
    return this.repository.findOne(params);
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria.where ?? criteria);
  }
}
