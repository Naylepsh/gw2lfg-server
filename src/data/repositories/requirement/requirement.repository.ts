import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Requirement } from "../../entities/requirement/requirement.entity";
import { IdentifiableEntityRepository } from "../generic-identifiable-entity.repository";
import { IRequirementRepository } from "./requirement.repository.interface";

@Service()
@EntityRepository(Requirement)
export class RequirementRepository
  extends IdentifiableEntityRepository<Requirement>
  implements IRequirementRepository {}
