import { Connection, EntityManager, ObjectType } from "typeorm";
import {
  IRaidBossRepository,
  RaidBossRepository,
} from "./raid-boss.repository";
import {
  IRaidPostRepository,
  RaidPostRepository,
} from "./raid-post.repository";
import {
  IRequirementRepository,
  RequirementRepository,
} from "./requirement.repository";
import { IRoleRepository, RoleRepository } from "./role.repository";
import { IUserRepository, UserRepository } from "./user.repository";

export interface IUnitOfWork {
  withTransaction<T>(work: () => T): Promise<T>;
}

export class TypeOrmUnitOfWork implements IUnitOfWork {
  private transactionManager: EntityManager | null;

  constructor(private connection: Connection) {}

  // currently only to be used with custom repositories
  getRepository<T>(customRepository: ObjectType<T>): T {
    if (!this.transactionManager) {
      throw new Error("Unit of work is not started. Call the start() method");
    }
    return this.transactionManager.getCustomRepository(customRepository);
  }

  async withTransaction<T>(work: () => T): Promise<T> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    this.transactionManager = queryRunner.manager;
    try {
      const result = await work();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      this.transactionManager = null;
    }
  }
}

export interface IRaidPostUnitOfWork extends IUnitOfWork {
  requirements: IRequirementRepository;
  roles: IRoleRepository;
  raidPosts: IRaidPostRepository;
  users: IUserRepository;
  raidBosses: IRaidBossRepository;
}

export class RaidPostUnitOfWork implements IRaidPostUnitOfWork {
  private constructor(private unitOfWork: TypeOrmUnitOfWork) {}
  withTransaction<T>(work: () => T): Promise<T> {
    return this.unitOfWork.withTransaction(work);
  }

  get users() {
    return this.unitOfWork.getRepository(UserRepository);
  }

  get raidBosses() {
    return this.unitOfWork.getRepository(RaidBossRepository);
  }

  get requirements() {
    return this.unitOfWork.getRepository(RequirementRepository);
  }

  get roles() {
    return this.unitOfWork.getRepository(RoleRepository);
  }

  get raidPosts() {
    return this.unitOfWork.getRepository(RaidPostRepository);
  }
}
