import { Requirement } from "@root/data/entities/requirement/requirement.entity";
import { User } from "@data/entities/user/user.entity";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";

export interface Item {
  name: string;
  quantity: number;
}

export interface ICheckRequirementsService {
  areRequirementsSatisfied(posts: RaidPost[], user: User): Promise<boolean[]>;
}

export interface ICheckItemRequirementsService {
  areRequirementsSatisfied(
    requirements: Requirement[],
    items: Item[]
  ): Promise<boolean>;
}
