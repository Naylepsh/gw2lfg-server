import { Repository, SelectQueryBuilder } from "typeorm";
import { OrderParams } from "./add-order";

interface Identifiable {
  id: number;
}

interface Options<Entity> {
  relations: string[];
  order?: OrderParams<Entity>;
}

export const findOneAndLoadRelations = async <Entity extends Identifiable>(
  qb: SelectQueryBuilder<Entity>,
  repository: Repository<Entity>,
  options: Options<Entity>
) => {
  const result = await qb.getOne();
  if (result) {
    return repository.findOne(result.id, options);
  } else {
    return result;
  }
};

export const findManyAndLoadRelations = async <Entity extends Identifiable>(
  qb: SelectQueryBuilder<Entity>,
  repository: Repository<Entity>,
  options: Options<Entity>
) => {
  const result = await qb.getMany();
  if (result.length > 0) {
    const ids = result.map((p) => p.id);
    return repository.findByIds(ids, options);
  } else {
    return result;
  }
};
