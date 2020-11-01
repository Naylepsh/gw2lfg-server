import { Posting } from "../entities/posting.entity";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IPostingRepository extends IRepository<Posting> {}

export class PostingRepository
  extends GenericRepository<Posting>
  implements IPostingRepository {}
