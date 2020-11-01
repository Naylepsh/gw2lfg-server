export interface IRepository<Model> {
  save(entity: Model): Promise<Model>;
  findById(id: number): Promise<Model | undefined>;
  delete(criteria?: any): Promise<void>;
}
