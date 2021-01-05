import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Post } from "../../entities/post/post.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { IPostRepository } from "./post.repository.interface";

@Service()
@EntityRepository(Post)
export class PostRepository
  extends IdentifiableEntityRepository<Post>
  implements IPostRepository {
  findById(id: number): Promise<Post | undefined> {
    const relations = ["author", "requirements", "roles"];
    return super.findById(id, relations);
  }
}
