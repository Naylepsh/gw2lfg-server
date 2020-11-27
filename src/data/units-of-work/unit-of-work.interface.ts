export interface IUnitOfWork {
  withTransaction<T>(work: () => T): Promise<T>;
}
