import { RaidPost } from "../../entities/raid-post/raid-post.entitity";
import {
  PostDeleteParams,
  PostWhereParams,
} from "../post/post.repository.interface";

export interface IRaidPostRepository {
  save(post: RaidPost): Promise<RaidPost>;
  findOne(params: RaidPostQueryParams): Promise<RaidPost | undefined>;
  findMany(params: RaidPostsQueryParams): Promise<RaidPost[]>;
  delete(params: PostDeleteParams): Promise<void>;
}

export interface RaidPostQueryParams {
  where?: RaidPostWhereParams;
}

export interface RaidPostsQueryParams extends RaidPostQueryParams {
  skip?: number;
  take?: number;
  order?: {
    [P in keyof RaidPost]?: "ASC" | "DESC";
  };
}

export interface RaidPostWhereParams extends PostWhereParams {
  bossesIds?: number[];
}
