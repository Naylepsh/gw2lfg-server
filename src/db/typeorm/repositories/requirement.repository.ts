import { getRepository } from "typeorm";
import { IRepository } from "../../repository";
import { Requirement } from "../entities/requirement.entity";

export class RequirementRepository implements IRepository<Requirement> {
  save(requirement: Requirement): Promise<Requirement> {
    return this.getRepo().save(requirement);
  }

  async findById(id: number): Promise<Requirement | null> {
    const requirement = await this.getRepo().findOne(id);
    return requirement ? requirement : null;
  }

  private getRepo() {
    return getRepository(Requirement);
  }
}
