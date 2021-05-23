import { SelectQueryBuilder } from "typeorm";

export type OrderParams<T extends Object> = {
  [Key in keyof T]?: "ASC" | "DESC";
};

export const addOrder = <T extends Object>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  params?: OrderParams<T>
) => {
  if (!params) return;

  for (const [key, order] of Object.entries(params)) {
    order && qb.orderBy(`${alias}.${key}`, order);
  }
};
