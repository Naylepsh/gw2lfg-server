import {
  GenericRepository,
  IdentifiableEntityRepository,
} from "./generic.repository";
import { JoinRequestRepository } from "./join-request/join-request.repository";
import { PostRepository } from "./post/post.repository";
import { RaidBossRepository } from "./raid-boss/raid-boss.repository";
import { RaidPostRepository } from "./raid-post/raid-post.repository";
import { RequirementRepository } from "./requirement/requirement.repository";
import { ItemRequirementRepository } from "./item-requirement/item-requirement.repository";
import { RoleRepository } from "./role/role.repository";
import { UserRepository } from "./user/user.repository";

export const repositories = {
  GenericRepository,
  IdentifiableEntityRepository,
  JoinRequestRepository,
  PostRepository,
  RaidBossRepository,
  RaidPostRepository,
  RequirementRepository,
  ItemRequirementRepository,
  RoleRepository,
  UserRepository,
};
