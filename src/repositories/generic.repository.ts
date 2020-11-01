import { AbstractRepository, EntityRepository } from "typeorm";
import { IRepository } from "./repository.interface";

@EntityRepository()
export class GenericRepository<Entity>
  extends AbstractRepository<Entity>
  implements IRepository<Entity> {
  save(entity: Entity): Promise<Entity> {
    return this.repository.save(entity);
  }

  findById(id: number, relations: string[] = []): Promise<Entity | undefined> {
    return this.repository.findOne(id, { relations });
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }
}
