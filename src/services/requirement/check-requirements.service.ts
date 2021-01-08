import { Service } from "typedi";
import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { User } from "@root/data/entities/user/user.entity";
import { requirementsCheckServiceType } from "@loaders/typedi.constants";
import { ICheckRequirementsService } from "./check-requirements.service.interface";

/*
Service for checking whether given requirements are satisfied by given user.
*/
@Service(requirementsCheckServiceType)
export class CheckRequirementsService implements ICheckRequirementsService {
  constructor(
    private readonly requirementCheckers: ICheckRequirementsService[]
  ) {}

  async areRequirementsSatisfied(
    requirements: Requirement[],
    user: User
  ): Promise<boolean> {
    // check requirements against all of the registered requirement checkers
    const checks = await Promise.all(
      this.requirementCheckers.map((checker) =>
        checker.areRequirementsSatisfied(requirements, user)
      )
    );

    // check whether all requirements passed
    const areAllSatisfied = checks.every((check) => check);
    return areAllSatisfied;
  }
}
