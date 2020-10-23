export interface IRepository<Entity> {
  save(entity: Entity): Entity;
  get(id: number): Entity;
}
