import {
  FindManyParams,
  FindOneParams,
  IRepository,
} from "../../../repositories/repository.interface";
import { turnIntoPromise } from "../turn-into-promise";

interface Identifiable {
  id: number;
}

export class MemoryRepository<Entity extends Identifiable>
  implements IRepository<Entity> {
  nextId = 0;
  readonly entities = new Map<number, Entity>();

  constructor(entities: Entity[] = []) {
    for (const user of entities) {
      user.id = this.nextId;
      this.entities.set(this.nextId++, user);
    }
  }

  save(entity: Entity): Promise<Entity> {
    return turnIntoPromise<Entity>(() => {
      if (this.contains(entity)) {
        this.entities.set(entity.id, entity);
      } else {
        const id = this.nextId;
        this.nextId++;

        entity.id = id;
        this.entities.set(id, entity);
      }

      return entity;
    });
  }

  async saveMany(entities: Entity[]): Promise<Entity[]> {
    for (const entity of entities) {
      await this.save(entity);
    }

    return entities;
  }

  private contains(entity: Entity) {
    return entity.id !== undefined && this.entities.has(entity.id);
  }

  async findOne(params: FindOneParams<Entity>): Promise<Entity | undefined> {
    const entities = await this.findMany(params);
    return entities.length > 0 ? entities[0] : undefined;
  }

  findMany(_params?: FindManyParams<Entity>): Promise<Entity[]> {
    let entities = Array.from(this.entities.values());

    if (_params?.order) {
      const orderParams = new Map(Object.entries(_params.order!));

      entities = entities.sort((a, b) => {
        const _a = new Map(Object.entries(a));
        const _b = new Map(Object.entries(b));

        for (const property in orderParams) {
          const order = orderParams.get(property);
          if (_a.get(property) > _b.get(property)) {
            return order === "ASC" ? 1 : -1;
          } else if (_a.get(property) < _b.get(property)) {
            return order === "ASC" ? -1 : 1;
          }
        }

        return 0;
      });
    }

    if (_params?.skip) {
      entities = entities.slice(_params.skip);
    }

    if (_params?.take) {
      entities = entities.slice(0, _params.take);
    }

    return turnIntoPromise(() => entities);
  }

  findById(id: number): Promise<Entity | undefined> {
    return turnIntoPromise<Entity | undefined>(() => {
      return this.entities.get(id);
    });
  }

  findByIds(ids: number[]): Promise<Entity[]> {
    return turnIntoPromise<Entity[]>(() => {
      const entities = ids
        .map((id) => this.entities.get(id))
        .filter((e) => !!e);
      return entities as Entity[];
    });
  }

  delete(_criteria?: any): Promise<void> {
    return turnIntoPromise<void>(() => {
      if (this.isArrayOfIds(_criteria)) {
        for (const id of _criteria) {
          this.entities.delete(id);
        }
      } else {
        this.entities.clear();
      }
    });
  }

  private isArrayOfIds(value: any) {
    return Array.isArray(value) && value.every((v) => typeof v === "number");
  }
}
