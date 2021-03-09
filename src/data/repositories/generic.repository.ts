import { AbstractRepository, EntityRepository } from "typeorm";
import { IRepository } from "./repository.interface";
import { FindManyParams } from "./find-many.params";
import { FindOneParams } from "./find-one.params";

/**
 * Generic repository over TypeORM repository containing common CRUD operations.
 */
@EntityRepository()
export class GenericRepository<Entity>
  extends AbstractRepository<Entity>
  implements IRepository<Entity> {
  save(entity: Entity): Promise<Entity> {
    return this.repository.save(entity);
  }

  saveMany(entities: Entity[]): Promise<Entity[]> {
    return this.repository.save(entities);
  }

  findOne(params: FindOneParams<Entity>): Promise<Entity | undefined> {
    return this.repository.findOne(params);
  }

  findMany(findParams?: FindManyParams<Entity>): Promise<Entity[]> {
    return this.repository.find(findParams);
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }
}
