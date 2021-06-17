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
  implements IRaidBossRepository
{
  save(raidBoss: RaidBoss): Promise<RaidBoss>;
  save(raidBosses: RaidBoss[]): Promise<RaidBoss[]>;
  save(raidBosses: any): Promise<RaidBoss> | Promise<RaidBoss[]> {
    return this.repository.save(raidBosses);
  }

  findOne(params: RaidBossQueryParams): Promise<RaidBoss | undefined> {
    return this.repository.findOne(params);
  }

  findMany(params: RaidBossQueryParams): Promise<RaidBoss[]> {
    return this.repository.find(params);
  }

  async delete(params: RaidBossQueryParams): Promise<void> {
    await this.repository.delete(params.where ?? {});
  }
}
