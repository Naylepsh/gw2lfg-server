import { Repository, SelectQueryBuilder } from "typeorm";

interface Identifiable {
  id: number;
}

export const findOneAndLoadRelations = async <Entity extends Identifiable>(
  qb: SelectQueryBuilder<Entity>,
  repository: Repository<Entity>,
  relations: string[]
) => {
  const result = await qb.getOne();
  if (result) {
    return repository.findOne(result.id, {
      relations,
    });
  } else {
    return result;
  }
};

export const findManyAndLoadRelations = async <Entity extends Identifiable>(
  qb: SelectQueryBuilder<Entity>,
  repository: Repository<Entity>,
  relations: string[]
) => {
  const result = await qb.getMany();
  if (result.length > 0) {
    const ids = result.map((p) => p.id);
    return repository.findByIds(ids, {
      relations,
    });
  } else {
    return result;
  }
};
