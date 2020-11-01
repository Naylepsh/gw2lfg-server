import { AbstractRepository } from "typeorm";
import { IRepository } from "./repository.interface";

export class GenericRepository<Entity>
  extends AbstractRepository<Entity>
  implements IRepository<Entity> {
  save(entity: Entity): Promise<Entity> {
    return this.repository.save(entity);
  }

  findById(id: number): Promise<Entity | undefined> {
    return this.repository.findOne(id);
  }
}
