import { FindOneParams } from "./find-one.params";
import { FindManyParams } from "./find-many.params";

export interface IRepository<Model> {
  save(entity: Model): Promise<Model>;
  saveMany(entities: Model[]): Promise<Model[]>;
  findOne(params: FindOneParams<Model>): Promise<Model | undefined>;
  findMany(params?: FindManyParams<Model>): Promise<Model[]>;
  delete(criteria?: any): Promise<void>;
}
