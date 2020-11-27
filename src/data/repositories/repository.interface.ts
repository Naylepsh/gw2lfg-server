export interface FindManyParams<Entity> {
  where?: any;
  take?: number;
  skip?: number;
  order?: { [P in keyof Entity]?: "ASC" | "DESC" };
  relations?: string[];
}

export interface FindOneParams<_Entity> {
  where?: any;
  relations?: string[];
}

export interface IRepository<Model> {
  save(entity: Model): Promise<Model>;
  saveMany(entities: Model[]): Promise<Model[]>;
  findOne(params: FindOneParams<Model>): Promise<Model | undefined>;
  findMany(params?: FindManyParams<Model>): Promise<Model[]>;
  delete(criteria?: any): Promise<void>;
}

export interface IIdentifiableEntityRepository<Entity>
  extends IRepository<Entity> {
  findById(id: number): Promise<Entity | undefined>;
  findByIds(ids: number[]): Promise<Entity[]>;
}
