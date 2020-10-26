import { getRepository } from "typeorm";
import { IRepository } from "../../repository";
import { Posting } from "../entities/posting.entity";

export class PostingRepository implements IRepository<Posting> {
  save(posting: Posting): Promise<Posting> {
    return this.getRepo().save(posting);
  }

  async findById(id: number): Promise<Posting | null> {
    const posting = await this.getRepo().findOne(id);
    return posting ? posting : null;
  }

  private getRepo() {
    return getRepository(Posting);
  }
}
