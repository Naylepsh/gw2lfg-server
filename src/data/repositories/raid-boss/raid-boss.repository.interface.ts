import { RaidBoss } from "../../entities/raid-boss/raid-boss.entity";
import { IIdentifiableEntityRepository } from "../identifiable-entity.repository.interface";

export interface IRaidBossRepository
  extends IIdentifiableEntityRepository<RaidBoss> {}
