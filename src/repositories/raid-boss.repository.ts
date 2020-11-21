import { EntityRepository } from "typeorm";
import { RaidBoss } from "../entities/raid-boss.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IRaidBossRepository extends IRepository<RaidBoss> {}

@EntityRepository()
export class RaidBossRepository
  extends IdentifiableEntityRepository<RaidBoss>
  implements IRaidBossRepository {}
