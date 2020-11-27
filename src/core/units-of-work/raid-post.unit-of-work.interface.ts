import { IRaidBossRepository } from "../repositories/raid-boss.repository.interface";
import { IRaidPostRepository } from "../repositories/raid-post.repository.interface";
import { IRequirementRepository } from "../repositories/requirement.repository.interface";
import { IRoleRepository } from "../repositories/role.repository.interface";
import { IUserRepository } from "../repositories/user.repository.interface";
import { IUnitOfWork } from "./unit-of-work.interface";

export interface IRaidPostUnitOfWork extends IUnitOfWork {
  requirements: IRequirementRepository;
  roles: IRoleRepository;
  raidPosts: IRaidPostRepository;
  users: IUserRepository;
  raidBosses: IRaidBossRepository;
}
