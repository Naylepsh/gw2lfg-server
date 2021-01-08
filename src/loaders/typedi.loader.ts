import Container from "typedi";
import { Connection, getConnection } from "typeorm";
import { data } from "../data";
// Imported only so that the TypeDI can acquire their metadata.
// As long as it's not a interface, just importing it is enough for TypeDI
import { services } from "../services";
import {
  itemRequirementRepositoryType,
  joinRequestRepositoryType,
  postRepositoryType,
  raidBossRepositoryType,
  raidPostRepositoryType,
  raidPostUnitOfWorkType,
  requirementRepositoryType,
  requirementsCheckServiceType,
  roleRepositoryType,
  userRepositoryType,
} from "./typedi.constants";

/*
Loads interfaces that TypeDI cannot automatically resolve
*/
export const loadTypeDI = () => {
  loadDataLayerDependencies();
  loadServiceLayerDependencies();

  return Container;
};

/*
Loads concrete classes from /data directory into TypeDI container, so that
TypeDI knows what implementation to use when encountered an interface
*/
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
  const {
    CheckItemRequirementsService,
    CheckRequirementsService,
    GetItemsFromEntireAccount,
  } = services;
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
