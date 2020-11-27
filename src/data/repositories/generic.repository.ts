import { AbstractRepository, EntityRepository } from "typeorm";
import {
  FindManyParams,
  FindOneParams,
  IIdentifiableEntityRepository,
  IRepository,
} from "../../core/repositories/repository.interface";

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

@EntityRepository()
export class IdentifiableEntityRepository<Entity>
  extends GenericRepository<Entity>
  implements IIdentifiableEntityRepository<Entity> {
  findById(id: number, relations: string[] = []): Promise<Entity | undefined> {
    return this.repository.findOne(id, { relations });
  }

  findByIds(ids: number[]): Promise<Entity[]> {
    return this.repository.findByIds(ids);
  }
}
