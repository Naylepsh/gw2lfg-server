import { Requirement } from "../../../entities/requirement.entity";
import { IRequirementRepository } from "../../../repositories/requirement.repository";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RequirementMemoryRepository
  extends IdentifiableMemoryRepository<Requirement>
  implements IRequirementRepository {}
