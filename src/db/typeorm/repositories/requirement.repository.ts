import { getConnection } from "typeorm";
import { IRequirement } from "../../../models/requirements/requirement.interface";
import { IRepository } from "../../repository";
import { Requirement } from "../entities/requirement.entity";
import { toDomain, toPersistence } from "../mappers/requirement.map";
import { MappingRepository } from "./repository";

export class RequirementRepository implements IRepository<IRequirement> {
  repository: MappingRepository<IRequirement, Requirement>;

  constructor() {
    const typeOrmRepo = getConnection().getRepository(Requirement);
    this.repository = new MappingRepository<IRequirement, Requirement>(
      toPersistence,
      toDomain,
      typeOrmRepo
    );
  }

  save(requirement: IRequirement): Promise<IRequirement> {
    return this.repository.save(requirement);
  }

  async findById(id: number): Promise<IRequirement | null> {
    return this.repository.findById(id);
  }
}
