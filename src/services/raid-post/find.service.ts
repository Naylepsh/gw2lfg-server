import { IRaidPostRepository } from "../../repositories/raid-post.repository";

export const find = async (
  skip: number | undefined,
  take: number | undefined,
  repository: IRaidPostRepository
) => {
  return repository.findMany({ order: { date: "DESC" }, skip, take });
};
