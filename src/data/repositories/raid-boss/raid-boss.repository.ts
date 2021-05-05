import { Service } from "typedi";
import { AbstractRepository, EntityRepository, In } from "typeorm";
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
    return this.repository.findOne(this.parseQueryParams(params));
  }

  findMany(params: RaidBossQueryParams): Promise<RaidBoss[]> {
    return this.repository.find(this.parseQueryParams(params));
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }

  parseQueryParams(params: RaidBossQueryParams) {
    if (params.where) {
      const { id, ...rest } = params.where;
      const where = {
        id: handleArrayableParam(id),
        ...rest,
      };
      return { ...params, where };
    }
    return params;
  }
}

function handleArrayableParam<T>(value: T) {
  if (typeof value === "undefined") return value;
  return In(Array.isArray(value) ? value : [value]);
}
