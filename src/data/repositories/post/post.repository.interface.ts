import { Post } from "../../entities/post/post.entity";

export interface IPostRepository {
  save(post: Post): Promise<Post>;
  findOne(params: PostQueryParams): Promise<Post | undefined>;
  findMany(params: PostsQueryParams): Promise<Post[]>;
  delete(criteria?: any): Promise<void>;
}

export interface PostQueryParams {
  where?: PostWhereParams;
}

export interface PostsQueryParams extends PostQueryParams {
  skip?: number;
  take?: number;
  order?: {
    [P in keyof Post]?: "ASC" | "DESC";
  };
}

export interface PostWhereParams {
  id?: number | number[];
  minDate?: Date;
  maxDate?: Date;
  server?: string;
  author?: PostWhereAuthorParams;
  role?: PostWhereRoleParams;
  joinRequest?: PostWhereJoinRequestParams;
}

export interface PostWhereAuthorParams {
  id?: number;
  name?: string;
}

export interface PostWhereRoleParams {
  name?: string | string[];
  class?: string | string[];
}

export interface PostWhereJoinRequestParams {
  status?: string;
  authorId?: number;
}
