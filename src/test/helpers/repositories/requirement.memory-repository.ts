import { Requirement } from "../../../core/entities/requirement.entity";
import { IRequirementRepository } from "../../../core/repositories/requirement.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RequirementMemoryRepository
  extends IdentifiableMemoryRepository<Requirement>
  implements IRequirementRepository {}
