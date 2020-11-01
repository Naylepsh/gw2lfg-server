import { EntityRepository } from "typeorm";
import { RaidBoss } from "../entities/raid-boss.entity";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IRaidBossRepository extends IRepository<RaidBoss> {}

@EntityRepository()
export class RaidBossRepository
  extends GenericRepository<RaidBoss>
  implements IRaidBossRepository {}
