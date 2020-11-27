import { Post } from "../entities/post.entity";
import { IIdentifiableEntityRepository } from "./repository.interface";

export interface IPostRepository extends IIdentifiableEntityRepository<Post> {}
