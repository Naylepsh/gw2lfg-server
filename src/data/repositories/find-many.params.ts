export interface FindManyParams<Entity> {
  where?: any;
  take?: number;
  skip?: number;
  order?: {
    [P in keyof Entity]?: "ASC" | "DESC";
  };
  relations?: string[];
}
