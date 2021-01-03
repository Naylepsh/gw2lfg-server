import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import {
  findRaidPostsServiceType,
  raidPostRepositoryType,
} from "@loaders/typedi.constants";
import { FindRaidPostsDTO } from "./dtos/find-raid-posts.dto";

@Service(findRaidPostsServiceType)
export class FindRaidPostsService {
  constructor(
    @Inject(raidPostRepositoryType)
    private readonly repository: IRaidPostRepository
  ) {}

  async find(dto: FindRaidPostsDTO) {
    const { skip, take, where } = dto;

    const posts = await this.repository.findMany({
      order: { date: "DESC" },
      skip,
      take: take + 1,
      where
    });

    if (posts.length === 0) {
      return { posts, hasMore: false };
    }
    return { posts: posts.slice(0, take), hasMore: posts.length === take + 1 };
  }
}
