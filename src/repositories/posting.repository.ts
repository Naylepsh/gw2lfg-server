import { EntityRepository } from "typeorm";
import { Posting } from "../entities/posting.entity";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IPostingRepository extends IRepository<Posting> {}

@EntityRepository(Posting)
export class PostingRepository
  extends GenericRepository<Posting>
  implements IPostingRepository {
  findById(id: number): Promise<Posting | undefined> {
    const relations = ["author", "requirements"];
    return super.findById(id, relations);
  }
}
