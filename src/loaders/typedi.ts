import Container from "typedi";
import { getConnection, Connection } from "typeorm";
import { JoinRequestRepository } from "../data/repositories/join-request/join-request.repository";
import { RaidBossRepository } from "../data/repositories/raid-boss/raid-boss.repository";
import { RaidPostRepository } from "../data/repositories/raid-post/raid-post.repository";
import { RequirementRepository } from "../data/repositories/requirement/requirement.repository";
import { RoleRepository } from "../data/repositories/role/role.repository";
import { UserRepository } from "../data/repositories/user/user.repository";
import { GetItemsFromEntireAccount } from "../services/gw2-api/gw2-api.service";
import { CheckItemRequirementsService } from "../services/requirement/check-item-requirements.service";
import { CheckRequirementsService } from "../services/requirement/check-requirements.service";
import {
  joinRequestRepositoryType,
  raidBossRepositoryType,
  raidPostRepositoryType,
  requirementRepositoryType,
  roleRepositoryType,
  userRepositoryType,
  requirementsCheckServiceType,
  postRepositoryType,
} from "./typedi.constants";
import "../services/raid-post/find.service";
import { PostRepository } from "../data/repositories/post/post.repository";

export const loadTypeDI = () => {
  const conn = getConnection();
  const userRepo = conn.getCustomRepository(UserRepository);
  const roleRepo = conn.getCustomRepository(RoleRepository);
  const requirementRepo = conn.getCustomRepository(RequirementRepository);
  const postRepo = conn.getCustomRepository(PostRepository);
  const raidPostRepo = conn.getCustomRepository(RaidPostRepository);
  const raidBossRepo = conn.getCustomRepository(RaidBossRepository);
  const joinRequestRepo = conn.getCustomRepository(JoinRequestRepository);

  Container.set(Connection, conn);
  Container.set(userRepositoryType, userRepo);
  Container.set(roleRepositoryType, roleRepo);
  Container.set(requirementRepositoryType, requirementRepo);
  Container.set(postRepositoryType, postRepo);
  Container.set(raidPostRepositoryType, raidPostRepo);
  Container.set(raidBossRepositoryType, raidBossRepo);
  Container.set(joinRequestRepositoryType, joinRequestRepo);

  const itemFetcher = new GetItemsFromEntireAccount();
  const itemRequirementCheckService = new CheckItemRequirementsService(
    itemFetcher
  );
  const checkRequirementService = new CheckRequirementsService([
    itemRequirementCheckService,
  ]);
  // Container.set(CheckRequirementsService, checkRequirementService);
  Container.set(requirementsCheckServiceType, checkRequirementService);

  return Container;
};
