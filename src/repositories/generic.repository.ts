import { AbstractRepository, EntityRepository } from "typeorm";
import { IRepository } from "./repository.interface";

export interface FindParams {
  where?: any;
  take?: number;
  skip?: number;
  relations?: string[];
}

@EntityRepository()
export class GenericRepository<Entity>
  extends AbstractRepository<Entity>
  implements IRepository<Entity> {
  save(entity: Entity): Promise<Entity> {
    return this.repository.save(entity);
  }

  findMany(findParams?: FindParams): Promise<Entity[]> {
    return this.repository.find(findParams);
  }

  findById(id: number, relations: string[] = []): Promise<Entity | undefined> {
    return this.repository.findOne(id, { relations });
  }

  findByIds(ids: number[]): Promise<Entity[]> {
    return this.repository.findByIds(ids);
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }
}
