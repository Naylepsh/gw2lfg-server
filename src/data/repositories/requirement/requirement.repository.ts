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
  implements IRequirementRepository
{
  save(requirement: Requirement): Promise<Requirement>;
  save(requirement: Requirement[]): Promise<Requirement[]>;
  save(requirement: any): Promise<Requirement> | Promise<Requirement[]> {
    return this.repository.save(requirement);
  }

  findOne(params: RequirementQueryParams): Promise<Requirement | undefined> {
    return this.repository.findOne(params);
  }

  async delete(params: RequirementQueryParams): Promise<void> {
    await this.repository.delete(params.where ?? {});
  }
}
