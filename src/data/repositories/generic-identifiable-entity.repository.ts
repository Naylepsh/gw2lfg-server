import { EntityRepository } from "typeorm";
import { IIdentifiableEntityRepository } from "./identifiable-entity.repository.interface";
import { GenericRepository } from "./generic.repository";

/*
Extension of generic repository containing additonal methods for entities with singular numerical primary key
*/
@EntityRepository()
export class IdentifiableEntityRepository<Entity>
  extends GenericRepository<Entity>
  implements IIdentifiableEntityRepository<Entity> {
  findById(id: number, relations: string[] = []): Promise<Entity | undefined> {
    // finds an entity with matching id and populates given relations
    return this.repository.findOne(id, { relations });
  }

  findByIds(ids: number[], relations: string[] = []): Promise<Entity[]> {
    // finds entities with matching ids and populates given relations
    return this.repository.findByIds(ids, { relations });
  }
}
