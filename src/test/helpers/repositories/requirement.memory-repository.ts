import { Requirement } from "../../../entities/requirement.entity";
import { IRequirementRepository } from "../../../repositories/requirement.repository";
import { MemoryRepository } from "./memory-repository";

export class RequirementMemoryRepository
  extends MemoryRepository<Requirement>
  implements IRequirementRepository {}
