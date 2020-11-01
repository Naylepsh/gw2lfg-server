import { RaidBoss } from "../entities/raid-boss.entity";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IRaidBossRepository extends IRepository<RaidBoss> {}

export class RaidBossRepository
  extends GenericRepository<RaidBoss>
  implements IRaidBossRepository {}
