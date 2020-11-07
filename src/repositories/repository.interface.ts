export interface IRepository<Model> {
  save(entity: Model): Promise<Model>;
  findById(id: number): Promise<Model | undefined>;
  findByIds(ids: number[]): Promise<Model[]>;
  delete(criteria?: any): Promise<void>;
}
