import { RaidBoss } from "../../entities/raid-boss.entity";
import { IIdentifiableEntityRepository } from "../repository.interface";

export interface IRaidBossRepository
  extends IIdentifiableEntityRepository<RaidBoss> {}
