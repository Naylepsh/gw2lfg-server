import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import {
  IRaidPostRepository,
  RaidPostQueryParams,
  RaidPostsQueryParams,
} from "@data/repositories/raid-post/raid-post.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RaidPostMemoryRepository implements IRaidPostRepository {
  public readonly repository: IdentifiableMemoryRepository<RaidPost>;
  constructor(entities: RaidPost[] = []) {
    this.repository = new IdentifiableMemoryRepository<RaidPost>(entities);
  }
  save(post: RaidPost): Promise<RaidPost> {
    return this.repository.save(post);
  }
  async findOne(params: RaidPostQueryParams): Promise<RaidPost | undefined> {
    const posts = await this.findMany({ skip: 0, take: 1, ...params });
    return posts[0];
  }
  findMany(params: RaidPostsQueryParams): Promise<RaidPost[]> {
    const { skip, take, ...where } = this.takeSimpleParams(params);
    return this.repository.findMany({ where });
  }
  delete(criteria?: any): Promise<void> {
    return this.repository.delete(criteria);
  }

  private takeSimpleParams(params: RaidPostsQueryParams) {
    const { skip, take, where: whereParams } = params;

    return {
      skip,
      take,
      id: whereParams?.id,
      author: whereParams?.author,
      server: whereParams?.server,
    };
  }
}
