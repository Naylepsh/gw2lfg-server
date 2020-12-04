import { Inject, Service } from "typedi";
import { Connection, EntityManager, ObjectType } from "typeorm";
import { IUnitOfWork } from "./unit-of-work.interface";

@Service()
export class TypeOrmUnitOfWork implements IUnitOfWork {
  private transactionManager: EntityManager | null;

  constructor(@Inject() private readonly connection: Connection) {}

  getCustomRepository<T>(customRepository: ObjectType<T>): T {
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
