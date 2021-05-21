import { In } from "typeorm";

export const all = () => {
  return {};
};

export const byId = (id: number) => {
  return { where: { id } };
};

export const byIds = (ids: number[]) => {
  return { where: { id: In(ids) } };
};
