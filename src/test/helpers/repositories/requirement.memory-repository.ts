import { Requirement } from "../../../data/entities/requirement.entity";
import { IRequirementRepository } from "../../../data/repositories/requirement/requirement.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RequirementMemoryRepository
  extends IdentifiableMemoryRepository<Requirement>
  implements IRequirementRepository {}
