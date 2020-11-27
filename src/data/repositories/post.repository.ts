import { EntityRepository } from "typeorm";
import { Post } from "../../core/entities/post.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IPostRepository } from "../../core/repositories/post.repository.interface";

@EntityRepository(Post)
export class PostRepository
  extends IdentifiableEntityRepository<Post>
  implements IPostRepository {
  findById(id: number): Promise<Post | undefined> {
    const relations = ["author", "requirements"];
    return super.findById(id, relations);
  }
}
