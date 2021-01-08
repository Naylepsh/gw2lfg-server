import { IRepository } from "./repository.interface";

export interface IIdentifiableEntityRepository<Entity>
  extends IRepository<Entity> {
  findById(id: number): Promise<Entity | undefined>;
  findByIds(ids: number[]): Promise<Entity[]>;
}
