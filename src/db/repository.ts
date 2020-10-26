export interface IRepository<Entity> {
  save(entity: Entity): Promise<Entity>;
  findById(id: number): Promise<Entity | null>;
}
