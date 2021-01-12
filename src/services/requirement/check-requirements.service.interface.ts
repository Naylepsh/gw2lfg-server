import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { User } from "@data/entities/user/user.entity";

export interface Item {
  name: string;
  quantity: number;
}

export interface ICheckRequirementsService {
  areRequirementsSatisfied(
    requirements: Requirement[],
    user: User
  ): Promise<boolean>;
}

export interface ICheckItemRequirementsService {
  areRequirementsSatisfied(
    requirements: Requirement[],
    items: Item[]
  ): Promise<boolean>;
}
