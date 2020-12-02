import { EntityRepository } from "typeorm";
import { Requirement } from "../../entities/requirement.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { IRequirementRepository } from "./requirement.repository.interface";

@EntityRepository(Requirement)
export class RequirementRepository
  extends IdentifiableEntityRepository<Requirement>
  implements IRequirementRepository {}