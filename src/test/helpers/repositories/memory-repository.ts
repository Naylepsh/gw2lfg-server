import { turnIntoPromise } from "../turn-into-promise";

interface Identifiable {
  id: number;
}

export class MemoryRepository<Entity extends Identifiable> {
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

  private contains(entity: Entity) {
    return entity.id !== undefined && this.entities.has(entity.id);
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
