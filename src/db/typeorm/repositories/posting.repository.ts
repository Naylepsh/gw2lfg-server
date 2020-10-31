import { getConnection } from "typeorm";
import { Posting as DomainPosting } from "../../../models/postings/posting.model";
import { IRepository } from "../../repository";
import { Posting as PersistencePosting } from "../entities/posting.entity";
import { toDomain, toPersistence } from "../mappers/posting.map";
import { MappingRepository } from "./repository";

export class PostingRepository implements IRepository<DomainPosting> {
  repository: MappingRepository<DomainPosting, PersistencePosting>;

  constructor() {
    const typeOrmRepo = getConnection().getRepository(PersistencePosting);
    this.repository = new MappingRepository<DomainPosting, PersistencePosting>(
      toPersistence,
      toDomain,
      typeOrmRepo
    );
  }

  save(posting: DomainPosting): Promise<DomainPosting> {
    return this.repository.save(posting);
  }

  async findById(id: number): Promise<DomainPosting | null> {
    return this.repository.findById(id);
  }
}
