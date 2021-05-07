import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { RaidBoss } from "../../entities/raid-boss/raid-boss.entity";
import {
  IRaidBossRepository,
  RaidBossQueryParams,
} from "./raid-boss.repository.interface";

@Service()
@EntityRepository(RaidBoss)
export class RaidBossRepository
  extends AbstractRepository<RaidBoss>
  implements IRaidBossRepository {
  save(raidBoss: RaidBoss): Promise<RaidBoss>;
  save(raidBosses: RaidBoss[]): Promise<RaidBoss[]>;
  save(raidBosses: RaidBoss | RaidBoss[]) {
    if (Array.isArray(raidBosses)) {
      return this.repository.save(raidBosses);
    }
    return this.repository.save(raidBosses);
  }

  findOne(params: RaidBossQueryParams): Promise<RaidBoss | undefined> {
    return this.repository.findOne(params);
  }

  findMany(params: RaidBossQueryParams): Promise<RaidBoss[]> {
    return this.repository.find(params);
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria.where ?? criteria);
  }
}
