import { EntityRepository } from "typeorm";
import { Requirement } from "../../core/entities/requirement.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IRequirementRepository } from "../../core/repositories/requirement.repository.interface";

@EntityRepository(Requirement)
export class RequirementRepository
  extends IdentifiableEntityRepository<Requirement>
  implements IRequirementRepository {}
