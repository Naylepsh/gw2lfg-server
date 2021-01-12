import { Inject, Service } from "typedi";
import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { User } from "@root/data/entities/user/user.entity";
import {
  checkItemRequirementsServiceType,
  findUserItemsServiceType,
  requirementsCheckServiceType,
} from "@loaders/typedi.constants";
import {
  ICheckItemRequirementsService,
  ICheckRequirementsService,
} from "./check-requirements.service.interface";
import { FindUserItemsService } from "../user/find-user-items.service";

/*
Service for checking whether given requirements are satisfied by given user.
*/
@Service(requirementsCheckServiceType)
export class CheckRequirementsService implements ICheckRequirementsService {
  constructor(
    @Inject(checkItemRequirementsServiceType)
    private readonly itemRequirementChecker: ICheckItemRequirementsService,
    @Inject(findUserItemsServiceType)
    private readonly findUserItemsService: FindUserItemsService
  ) {}

  async areRequirementsSatisfied(
    requirements: Requirement[],
    user: User
  ): Promise<boolean> {
    const items = await this.findUserItemsService.find({ id: user.id });

    const areRequirementsSatisfied = await this.itemRequirementChecker.areRequirementsSatisfied(
      requirements,
      items
    );

    return areRequirementsSatisfied;
  }
}
