import { EntityRepository } from "typeorm";
import { IIdentifiableEntityRepository } from "./identifiable-entity.repository.interface";
import { GenericRepository } from "./generic.repository";

/**
 * Extension of generic repository containing additonal methods for entities with singular numerical primary key
 */
@EntityRepository()
export class IdentifiableEntityRepository<Entity>
  extends GenericRepository<Entity>
  implements IIdentifiableEntityRepository<Entity> {
  findById(id: number, relations: string[] = []): Promise<Entity | undefined> {
    return this.repository.findOne(id, { relations });
  }

  findByIds(ids: number[], relations: string[] = []): Promise<Entity[]> {
    return this.repository.findByIds(ids, { relations });
  }
}
