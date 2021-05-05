import { IRepository } from "@data/repositories/repository.interface";
import { IIdentifiableEntityRepository } from "@data/repositories/identifiable-entity.repository.interface";
import { FindManyParams } from "@data/repositories/find-many.params";
import { FindOneParams } from "@data/repositories/find-one.params";

export abstract class MemoryRepository<Entity> implements IRepository<Entity> {
  entities: Entity[] = [];

  constructor(entities: Entity[] = []) {
    this.entities.push(...entities);
  }

  async save(entity: Entity): Promise<Entity> {
    const entities = this.entities.filter(
      (e) => !this.areEntitiesEqual(e, entity)
    );
    entities.push(entity);
    this.entities = entities;

    return entity;
  }

  abstract areEntitiesEqual(_entity: Entity, _otherEntity: Entity): boolean;

  saveMany(entities: Entity[]): Promise<Entity[]> {
    return Promise.all(entities.map((entity) => this.save(entity)));
  }

  async findOne(params: FindOneParams<Entity>): Promise<Entity | undefined> {
    const all = await this.findMany(params);
    return all.length > 0 ? all[0] : undefined;
  }

  async findMany(params?: FindManyParams<Entity>): Promise<Entity[]> {
    let entities = Array.from(this.entities.values());

    if (params?.order) {
      const orderParams = new Map(Object.entries(params.order!));

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

    if (params?.where) {
      entities = entities.filter((entity) =>
        this.handleWhere(entity, params.where)
      );
    }

    if (params?.skip) {
      entities = entities.slice(params.skip);
    }

    if (params?.take) {
      entities = entities.slice(0, params.take);
    }

    return entities;
  }

  handleWhere(entity: any, where: any) {
    for (const [key, value] of Object.entries(where)) {
      if (value === undefined) {
        continue;
      }
      if (typeof value === "object") {
        const res = this.handleWhere(entity[key], value);
        if (!res) return false;
      } else if ((entity as any)[key] !== value) {
        return false;
      }
    }
    return true;
  }

  delete(_criteria?: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

interface Identifiable {
  id: number;
}

export class IdentifiableMemoryRepository<Entity extends Identifiable>
  extends MemoryRepository<Entity>
  implements IIdentifiableEntityRepository<Entity> {
  nextId = 1;

  constructor(entities: Entity[] = []) {
    super(entities);
    for (const entity of entities) {
      entity.id = this.nextId;
      this.nextId++;
    }
  }

  async findById(id: number): Promise<Entity | undefined> {
    const entities = this.entities.filter((e) => e.id === id);
    return entities.length === 1 ? entities[0] : undefined;
  }

  async findByIds(ids: number[]): Promise<Entity[]> {
    return this.entities.filter((e) => ids.includes(e.id));
  }

  async save(entity: Entity): Promise<Entity> {
    if (!this.entities.map((e) => e.id).includes(entity.id)) {
      entity.id = this.nextId;
      this.nextId++;
    }

    await super.save(entity);

    return entity;
  }

  async saveMany(entities: Entity[]): Promise<Entity[]> {
    const usedIds = this.entities.map((e) => e.id);
    for (const entity of entities) {
      if (!usedIds.includes(entity.id)) {
        entity.id = this.nextId;
        this.nextId++;
      }
    }

    await super.saveMany(entities);

    return entities;
  }

  async delete(_criteria?: any): Promise<void> {
    if (this.isArrayOfIds(_criteria)) {
      const ids = _criteria as number[];
      this.entities = this.entities.filter((e) => !ids.includes(e.id));
    } else {
      this.entities = [];
    }
  }

  areEntitiesEqual(entity: Entity, otherEntity: Entity): boolean {
    return entity.id === otherEntity.id;
  }

  private isArrayOfIds(value: any) {
    return Array.isArray(value) && value.every((v) => typeof v === "number");
  }
}
