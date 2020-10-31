import { IRepository } from "../../repository";
import { RaidBoss as PersistenceRaidBoss } from "../entities/raid-boss.entity";
import { RaidBoss as DomainRaidBoss } from "../../../models/postings/raid-posting.model";
import { toDomain, toPersistence } from "../mappers/raid-boss.map";
import { getConnection } from "typeorm";
import { MappingRepository } from "./repository";

export class RaidBossRepository implements IRepository<DomainRaidBoss> {
  repository: MappingRepository<DomainRaidBoss, PersistenceRaidBoss>;

  constructor() {
    const typeOrmRepo = getConnection().getRepository(PersistenceRaidBoss);
    this.repository = new MappingRepository<
      DomainRaidBoss,
      PersistenceRaidBoss
    >(toPersistence, toDomain, typeOrmRepo);
  }

  save(boss: DomainRaidBoss): Promise<DomainRaidBoss> {
    return this.repository.save(boss);
  }

  async findById(id: number): Promise<DomainRaidBoss | null> {
    return this.repository.findById(id);
  }
}
