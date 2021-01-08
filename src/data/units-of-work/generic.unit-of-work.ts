import { Inject, Service } from "typedi";
import { Connection, EntityManager, ObjectType } from "typeorm";
import { IUnitOfWork } from "./unit-of-work.interface";

/*
Generic implementation of Unit of Work pattern.
Allows execution of multiple operations on multiple repositions in single transaction.
Call to withTransaction has to preceed all operations on repositories.
UoW has a lifetime of only one transaction, after that it cannot run anymore.
*/
@Service()
export class GenericUnitOfWork implements IUnitOfWork {
  private transactionManager: EntityManager | null;

  constructor(@Inject() private readonly connection: Connection) {}

  getCustomRepository<T>(customRepository: ObjectType<T>): T {
    if (!this.transactionManager) {
      throw new Error(
        "Unit of work is not started. Wrap it around withTransaction"
      );
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
