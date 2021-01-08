import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Post } from "../../entities/post/post.entity";
import { IdentifiableEntityRepository } from "../generic-identifiable-entity.repository";
import { IPostRepository } from "./post.repository.interface";

@Service()
@EntityRepository(Post)
export class PostRepository
  extends IdentifiableEntityRepository<Post>
  implements IPostRepository {
  private static relations = ["author", "requirements", "roles"];

  findById(id: number): Promise<Post | undefined> {
    // find post with matching id and populate relations
    return super.findById(id, PostRepository.relations);
  }
}
