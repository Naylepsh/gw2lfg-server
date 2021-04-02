import { Post } from "../../entities/post/post.entity";

export interface IPostRepository {
  save(post: Post): Promise<Post>;
  findOne(params: PostQueryParams): Promise<Post | undefined>;
  findMany(params: PostsQueryParams): Promise<Post[]>;
  delete(criteria?: any): Promise<void>;
}

export interface PostQueryParams {
  whereParams?: PostWhereParams;
}

export interface PostsQueryParams extends PostQueryParams {
  skip?: number;
  take?: number;
}

export interface PostWhereParams {
  id?: number;
  minDate?: string;
  server?: string;
  author?: PostWhereAuthorParams;
  role?: PostWhereRoleParams;
}

export interface PostWhereAuthorParams {
  id?: number;
  name?: string;
}

export interface PostWhereRoleParams {
  name?: string;
  eitherName?: [string, string];
  class?: string;
  eitherClass?: [string, string];
}
