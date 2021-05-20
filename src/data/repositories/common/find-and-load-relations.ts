import { Repository, SelectQueryBuilder } from "typeorm";

interface Identifiable {
  id: number;
}

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
