import { Post } from "../../entities/post/post.entity";
import { IIdentifiableEntityRepository } from "../identifiable-entity.repository.interface";

export interface IPostRepository extends IIdentifiableEntityRepository<Post> {}
