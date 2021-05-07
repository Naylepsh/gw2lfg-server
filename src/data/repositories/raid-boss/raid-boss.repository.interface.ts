import { FindOperator } from "typeorm";
import { RaidBoss } from "../../entities/raid-boss/raid-boss.entity";

export interface IRaidBossRepository {
  save(raidBoss: RaidBoss): Promise<RaidBoss>;
  save(raidBosses: RaidBoss[]): Promise<RaidBoss[]>;
  findOne(params: RaidBossQueryParams): Promise<RaidBoss | undefined>;
  findMany(params: RaidBossQueryParams): Promise<RaidBoss[]>;
  delete(criteria?: any): Promise<void>;
}

export interface RaidBossQueryParams {
  where?: {
    id?: number | FindOperator<number>;
    name?: string;
    isCm?: boolean;
  };
}
