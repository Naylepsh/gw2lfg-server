import { In } from "typeorm";

export function all() {
  return {};
}

export function byId(id: number) {
  return { where: { id } };
}

export function byIds(ids: number[]) {
  return { where: { id: In(ids) } };
}
