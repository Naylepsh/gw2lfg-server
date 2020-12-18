import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import {
  findRaidPostsServiceType,
  raidPostRepositoryType,
} from "@loaders/typedi.constants";

export interface FindRaidPostParams {
  skip?: number;
  take?: number;
}

@Service(findRaidPostsServiceType)
export class FindRaidPostService {
  constructor(
    @Inject(raidPostRepositoryType)
    private readonly repository: IRaidPostRepository
  ) {}

  find(params: FindRaidPostParams) {
    const { skip, take } = params;
    return this.repository.findMany({ order: { date: "DESC" }, skip, take });
  }
}
