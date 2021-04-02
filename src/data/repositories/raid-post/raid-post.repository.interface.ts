import { RaidPost } from "../../entities/raid-post/raid-post.entitity";
import { PostWhereParams } from "../post/post.repository.interface";

export interface IRaidPostRepository {
  save(post: RaidPost): Promise<RaidPost>;
  findOne(params: RaidPostQueryParams): Promise<RaidPost | undefined>;
  findMany(params: RaidPostsQueryParams): Promise<RaidPost[]>;
  delete(criteria?: any): Promise<void>;
}

export interface RaidPostQueryParams {
  whereParams?: RaidPostWhereParams;
}

export interface RaidPostsQueryParams extends RaidPostQueryParams {
  skip?: number;
  take?: number;
}

export interface RaidPostWhereParams extends PostWhereParams {
  bossesIds?: number[];
}
