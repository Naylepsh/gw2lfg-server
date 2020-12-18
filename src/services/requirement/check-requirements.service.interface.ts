import { Requirement } from "@data/entities/requirement.entity";
import { User } from "@data/entities/user.entity";

export interface ICheckRequirementsService {
  areRequirementsSatisfied(
    requirements: Requirement[],
    user: User
  ): Promise<boolean>;
}
