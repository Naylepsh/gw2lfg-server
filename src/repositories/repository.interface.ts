export interface FindParams<Entity> {
  where?: any;
  take?: number;
  skip?: number;
  order?: { [P in keyof Entity]?: "ASC" | "DESC" };
  relations?: string[];
}

export interface IRepository<Model> {
  save(entity: Model): Promise<Model>;
  findMany(params?: FindParams<Model>): Promise<Model[]>;
  findById(id: number): Promise<Model | undefined>;
  findByIds(ids: number[]): Promise<Model[]>;
  delete(criteria?: any): Promise<void>;
}
