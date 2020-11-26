import { IRaidPostRepository } from "../../repositories/raid-post.repository";

export interface FindRaidPostParams {
  skip?: number;
  take?: number;
}

export class FindRaidPostService {
  constructor(private readonly repository: IRaidPostRepository) {}

  find(params: FindRaidPostParams) {
    const { skip, take } = params;
    return this.repository.findMany({ order: { date: "DESC" }, skip, take });
  }
}