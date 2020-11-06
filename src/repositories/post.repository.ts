import { EntityRepository } from "typeorm";
import { Post } from "../entities/post.entity";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IPostRepository extends IRepository<Post> {}

@EntityRepository(Post)
export class PostRepository
  extends GenericRepository<Post>
  implements IPostRepository {
  findById(id: number): Promise<Post | undefined> {
    const relations = ["author", "requirements"];
    return super.findById(id, relations);
  }
}
