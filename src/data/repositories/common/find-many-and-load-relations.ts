import { Repository, SelectQueryBuilder } from "typeorm";
import { Identifiable } from "./identifiable.interface";

export async function findManyAndLoadRelations<Entity extends Identifiable>(
  qb: SelectQueryBuilder<Entity>,
  repository: Repository<Entity>,
  relations: string[]
) {
  const result = await qb.getMany();
  if (result.length > 0) {
    return repository.findByIds(
      result.map((p) => p.id),
      {
        relations,
      }
    );
  } else {
    return result;
  }
}
