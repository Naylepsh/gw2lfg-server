import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import {
  findRaidPostsServiceType,
  raidPostRepositoryType,
} from "@loaders/typedi.constants";

export interface FindRaidPostDTO {
  skip: number;
  take: number;
}

@Service(findRaidPostsServiceType)
export class FindRaidPostService {
  constructor(
    @Inject(raidPostRepositoryType)
    private readonly repository: IRaidPostRepository
  ) {}

  async find(params: FindRaidPostDTO) {
    const { skip, take } = params;

    const posts = await this.repository.findMany({
      order: { date: "DESC" },
      skip,
      take: take + 1,
    });

    if (posts.length === 0) {
      return { posts, hasMore: false };
    }
    return { posts: posts.slice(0, take), hasMore: posts.length === take + 1 };
  }
}
