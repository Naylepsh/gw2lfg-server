import { Service } from "typedi";
import { Requirement } from "../../data/entities/requirement.entity";
import { User } from "../../data/entities/user.entity";
import { requirementsCheckServiceType } from "../../loaders/typedi.constants";
import { ICheckRequirementsService } from "./check-requirements.service.interface";

@Service(requirementsCheckServiceType)
export class CheckRequirementsService implements ICheckRequirementsService {
  constructor(
    private readonly requirementCheckers: ICheckRequirementsService[]
  ) {}

  async areRequirementsSatisfied(
    requirements: Requirement[],
    user: User
  ): Promise<boolean> {
    const checks = await Promise.all(
      this.requirementCheckers.map((checker) =>
        checker.areRequirementsSatisfied(requirements, user)
      )
    );
    const areAllSatisfied = checks.every((check) => check);
    return areAllSatisfied;
  }
}