import { In } from "typeorm";

export function byIds(ids: number[]) {
  return { where: { id: In(ids) } };
}
