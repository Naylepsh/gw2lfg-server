import { SelectQueryBuilder } from "typeorm";

export function paginate<Entity>(
  qb: SelectQueryBuilder<Entity>,
  params: { skip?: number; take?: number }
) {
  const { skip, take } = params;

  if (skip) {
    qb.skip(skip);
  }

  if (take) {
    qb.take(take);
  }
}
