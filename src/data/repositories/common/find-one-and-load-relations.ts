import { Repository, SelectQueryBuilder } from "typeorm";
import { Identifiable } from "./identifiable.interface";

export async function findOneAndLoadRelations<Entity extends Identifiable>(
  qb: SelectQueryBuilder<Entity>,
  repository: Repository<Entity>,
  relations: string[]
) {
  const result = await qb.getOne();
  if (result) {
    return repository.findOne(result.id, {
      relations,
    });
  } else {
    return result;
  }
}
