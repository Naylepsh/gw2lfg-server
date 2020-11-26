import { EntityRepository } from "typeorm";
import { Post } from "../entities/post.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IIdentifiableEntityRepository } from "./repository.interface";

export interface IPostRepository extends IIdentifiableEntityRepository<Post> {}

@EntityRepository(Post)
export class PostRepository
  extends IdentifiableEntityRepository<Post>
  implements IPostRepository {
  findById(id: number): Promise<Post | undefined> {
    const relations = ["author", "requirements"];
    return super.findById(id, relations);
  }
}
