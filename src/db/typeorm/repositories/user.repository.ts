import { getConnection } from "typeorm";
import { User as DomainUser } from "../../../models/user.model";
import { IRepository } from "../../repository";
import { User as PersistenceUser } from "../entities/user.entity";
import { toDomain, toPersistence } from "../mappers/user.map";
import { MappingRepository } from "./repository";

export class UserRepository implements IRepository<DomainUser> {
  repository: MappingRepository<DomainUser, PersistenceUser>;

  constructor() {
    const typeOrmRepo = getConnection().getRepository(PersistenceUser);
    this.repository = new MappingRepository<DomainUser, PersistenceUser>(
      toPersistence,
      toDomain,
      typeOrmRepo
    );
  }

  save(user: DomainUser): Promise<DomainUser> {
    return this.repository.save(user);
  }

  async findById(id: number): Promise<DomainUser | null> {
    return this.repository.findById(id);
  }

  async findByUsername(username: string): Promise<DomainUser | null> {
    return this.repository.findByProperty("username", username);
  }
}
