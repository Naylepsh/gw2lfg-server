import { IJoinRequestRepository } from "../../repositories/join-request/join-request.repository.interface";
import { IRaidBossRepository } from "../../repositories/raid-boss/raid-boss.repository.interface";
import { IRaidPostRepository } from "../../repositories/raid-post/raid-post.repository.interface";
import { IRequirementRepository } from "../../repositories/requirement/requirement.repository.interface";
import { IRoleRepository } from "../../repositories/role/role.repository.interface";
import { IUserRepository } from "../../repositories/user/user.repository.interface";
import { IUnitOfWork } from "../unit-of-work.interface";

export interface IRaidPostUnitOfWork extends IUnitOfWork {
  requirements: IRequirementRepository;
  roles: IRoleRepository;
  raidPosts: IRaidPostRepository;
  users: IUserRepository;
  raidBosses: IRaidBossRepository;
  joinRequests: IJoinRequestRepository;
}
