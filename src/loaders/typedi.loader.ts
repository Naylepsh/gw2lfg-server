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
  itemRequirementRepositoryType,
} from "./typedi.constants";
import "../services/raid-post/find-raid-post.service";
import "../services/raid-post/find-raid-posts.service";
import "../services/raid-post/publish-raid-posts.service";
import { data } from "../data";

export const loadTypeDI = () => {
  loadDataLayerDependencies();
  loadServiceLayerDependencies();

  return Container;
};

const loadDataLayerDependencies = () => {
  const { repositories: repos, unitsOfWork: uows } = data;

  const conn = getConnection();
  Container.set(Connection, conn);

  const userRepo = conn.getCustomRepository(repos.UserRepository);
  Container.set(userRepositoryType, userRepo);

  const roleRepo = conn.getCustomRepository(repos.RoleRepository);
  Container.set(roleRepositoryType, roleRepo);

  const requirementRepo = conn.getCustomRepository(repos.RequirementRepository);
  Container.set(requirementRepositoryType, requirementRepo);

  const itemRequirementRepo = conn.getCustomRepository(
    repos.ItemRequirementRepository
  );
  Container.set(itemRequirementRepositoryType, itemRequirementRepo);

  const postRepo = conn.getCustomRepository(repos.PostRepository);
  Container.set(postRepositoryType, postRepo);

  const raidPostRepo = conn.getCustomRepository(repos.RaidPostRepository);
  Container.set(raidPostRepositoryType, raidPostRepo);

  const raidBossRepo = conn.getCustomRepository(repos.RaidBossRepository);
  Container.set(raidBossRepositoryType, raidBossRepo);

  const joinRequestRepo = conn.getCustomRepository(repos.JoinRequestRepository);
  Container.set(joinRequestRepositoryType, joinRequestRepo);

  const genericUow = new uows.GenericUnitOfWork(conn);
  const raidPostUow = new uows.RaidPostUnitOfWork(genericUow);
  Container.set(raidPostUnitOfWorkType, raidPostUow);
};

const loadServiceLayerDependencies = () => {
  const itemFetcher = new GetItemsFromEntireAccount();
  const itemRequirementCheckService = new CheckItemRequirementsService(
    itemFetcher
  );
  const checkRequirementService = new CheckRequirementsService([
    itemRequirementCheckService,
  ]);
  Container.set(CheckRequirementsService, checkRequirementService);
  Container.set(requirementsCheckServiceType, checkRequirementService);
};
