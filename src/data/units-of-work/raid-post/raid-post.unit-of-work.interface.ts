import { IItemRequirementRepository } from "../../repositories/item-requirement/item-requirement.repository.interface";
import { IJoinRequestRepository } from "../../repositories/join-request/join-request.repository.interface";
import { IRaidBossRepository } from "../../repositories/raid-boss/raid-boss.repository.interface";
import { IRaidPostRepository } from "../../repositories/raid-post/raid-post.repository.interface";
import { IRequirementRepository } from "../../repositories/requirement/requirement.repository.interface";
import { IRoleRepository } from "../../repositories/role/role.repository.interface";
import { IUnitOfWork } from "../unit-of-work.interface";

export interface IRaidPostUnitOfWork extends IUnitOfWork {
  requirements: IRequirementRepository;
  itemRequirements: IItemRequirementRepository;
  roles: IRoleRepository;
  raidPosts: IRaidPostRepository;
  raidBosses: IRaidBossRepository;
  joinRequests: IJoinRequestRepository;
}
