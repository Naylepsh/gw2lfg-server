import Container from "typedi";
import { getConnection, Connection } from "typeorm";
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
  raidPostUnitOfWorkType,
} from "./typedi.constants";
import "../services/raid-post/find.service";
import "../services/raid-post/publish.service";
import { data } from "../data";

export const loadTypeDI = () => {
  const { repositories: repos, unitsOfWork: uows } = data;

  const conn = getConnection();
  const userRepo = conn.getCustomRepository(repos.UserRepository);
  const roleRepo = conn.getCustomRepository(repos.RoleRepository);
  const requirementRepo = conn.getCustomRepository(repos.RequirementRepository);
  const postRepo = conn.getCustomRepository(repos.PostRepository);
  const raidPostRepo = conn.getCustomRepository(repos.RaidPostRepository);
  const raidBossRepo = conn.getCustomRepository(repos.RaidBossRepository);
  const joinRequestRepo = conn.getCustomRepository(repos.JoinRequestRepository);
  const genericUow = new uows.GenericUnitOfWork(conn);
  const raidPostUow = new uows.RaidPostUnitOfWork(genericUow);

  Container.set(Connection, conn);
  Container.set(userRepositoryType, userRepo);
  Container.set(roleRepositoryType, roleRepo);
  Container.set(requirementRepositoryType, requirementRepo);
  Container.set(postRepositoryType, postRepo);
  Container.set(raidPostRepositoryType, raidPostRepo);
  Container.set(raidBossRepositoryType, raidBossRepo);
  Container.set(joinRequestRepositoryType, joinRequestRepo);
  Container.set(raidPostUnitOfWorkType, raidPostUow);

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
