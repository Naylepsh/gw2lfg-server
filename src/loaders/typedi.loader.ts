import Container from "typedi";
import { Connection, getConnection } from "typeorm";
import { data } from "../data";
/**
 * Most services are imported only so that the TypeDI can acquire their metadata.
 * As long as it's not a interface, just importing it is enough for TypeDI.
 */
import { services } from "../services";
import {
  getItemsFromEntireAccountFetcherType,
  itemRequirementRepositoryType,
  joinRequestRepositoryType,
  postRepositoryType,
  raidBossRepositoryType,
  raidPostRepositoryType,
  raidPostUnitOfWorkType,
  requirementRepositoryType,
  roleRepositoryType,
  userRepositoryType,
} from "./typedi.constants";

/**
 * Loads interfaces that TypeDI cannot automatically resolve
 */
export const loadTypeDI = () => {
  loadDataLayerDependencies();
  loadServiceLayerDependencies();
};

/**
 * Loads concrete classes from /data directory into TypeDI container, so that
 * TypeDI knows what implementation to use when encountered an interface
 */
const loadDataLayerDependencies = () => {
  const conn = getConnection();

  Container.set(Connection, conn);

  loadRepositories(conn);
  loadUnitOfWork(conn);
};

function loadUnitOfWork(conn: Connection) {
  const { unitsOfWork: uows } = data;

  const genericUow = new uows.GenericUnitOfWork(conn);
  const raidPostUow = new uows.RaidPostUnitOfWork(genericUow);
  Container.set(raidPostUnitOfWorkType, raidPostUow);
}

function loadRepositories(conn: Connection) {
  const { repositories: repos } = data;

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
}

/**
 * Loads concrete classes from /service directory into TypeDI container, so that
 * TypeDI knows what implementation to use when encountered an interface.
 * At the moment it's only CheckRequirementsService that needs a special loading care
 */
const loadServiceLayerDependencies = () => {
  const { GetItemsFromEntireAccount } = services;

  const itemFetcher = new GetItemsFromEntireAccount();

  Container.set(getItemsFromEntireAccountFetcherType, itemFetcher);
};
