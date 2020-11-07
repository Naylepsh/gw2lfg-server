import { Connection, EntityManager, ObjectType, QueryRunner } from "typeorm";
import { RaidPostRepository } from "./raid-post.repository";
import { RequirementRepository } from "./requirement.repository";
import { RoleRepository } from "./role.repository";

interface IUnitOfWork {
  start: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

export class TypeOrmUnitOfWork implements IUnitOfWork {
  private readonly queryRunner: QueryRunner;
  private transactionManager: EntityManager;

  constructor(connection: Connection) {
    this.queryRunner = connection.createQueryRunner();
  }

  setTransactionManager() {
    this.transactionManager = this.queryRunner.manager;
  }

  async start(): Promise<void> {
    await this.queryRunner.startTransaction();
    this.setTransactionManager();
  }

  // currently only to be used with custom repositories
  getRepository<T>(customRepository: ObjectType<T>): T {
    if (!this.transactionManager) {
      throw new Error("Unit of work is not started. Call the start() method");
    }
    return this.transactionManager.getCustomRepository(customRepository);
  }

  async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
  }

  async rollback(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
  }
}

export class RaidPostUnitOfWork implements IUnitOfWork {
  private unitOfWork: TypeOrmUnitOfWork;

  constructor(connection: Connection) {
    this.unitOfWork = new TypeOrmUnitOfWork(connection);
  }

  getRequirementRepository() {
    return this.unitOfWork.getRepository(RequirementRepository);
  }

  getRoleRepository() {
    return this.unitOfWork.getRepository(RoleRepository);
  }

  getRaidPostRepository() {
    return this.unitOfWork.getRepository(RaidPostRepository);
  }

  async start() {
    return this.unitOfWork.start();
  }

  async commit() {
    return this.unitOfWork.commit();
  }

  async rollback() {
    return this.unitOfWork.rollback();
  }
}
