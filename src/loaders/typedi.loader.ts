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
  types,
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

const loadUnitOfWork = (conn: Connection) => {
  const { unitsOfWork: uows } = data;

  const genericUow = new uows.GenericUnitOfWork(conn);
  const raidPostUow = new uows.RaidPostUnitOfWork(genericUow);
  Container.set(types.uows.raidPost, raidPostUow);
};

const loadRepositories = (conn: Connection) => {
  const { repositories: repos } = data;

  const userRepo = conn.getCustomRepository(repos.UserRepository);
  Container.set(types.repositories.user, userRepo);

  const roleRepo = conn.getCustomRepository(repos.RoleRepository);
  Container.set(types.repositories.role, roleRepo);

  const requirementRepo = conn.getCustomRepository(repos.RequirementRepository);
  Container.set(types.repositories.requirement, requirementRepo);

  const itemRequirementRepo = conn.getCustomRepository(
    repos.ItemRequirementRepository
  );
  Container.set(types.repositories.itemRequirement, itemRequirementRepo);

  const postRepo = conn.getCustomRepository(repos.PostRepository);
  Container.set(types.repositories.post, postRepo);

  const raidPostRepo = conn.getCustomRepository(repos.RaidPostRepository);
  Container.set(types.repositories.raidPost, raidPostRepo);

  const raidBossRepo = conn.getCustomRepository(repos.RaidBossRepository);
  Container.set(types.repositories.raidBoss, raidBossRepo);

  const joinRequestRepo = conn.getCustomRepository(repos.JoinRequestRepository);
  Container.set(types.repositories.joinRequest, joinRequestRepo);
};

/**
 * Loads concrete classes from /service directory into TypeDI container, so that
 * TypeDI knows what implementation to use when encountered an interface.
 */
const loadServiceLayerDependencies = () => {
  const { GetItemsFromEntireAccount } = services;

  const itemFetcher = new GetItemsFromEntireAccount();

  Container.set(getItemsFromEntireAccountFetcherType, itemFetcher);
};
