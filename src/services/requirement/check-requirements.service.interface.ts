import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { User } from "@root/data/entities/user/user.entity";

export interface ICheckRequirementsService {
  areRequirementsSatisfied(
    requirements: Requirement[],
    user: User
  ): Promise<boolean>;
}
