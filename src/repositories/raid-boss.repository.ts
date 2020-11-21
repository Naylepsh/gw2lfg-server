import { EntityRepository } from "typeorm";
import { RaidBoss } from "../entities/raid-boss.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IIdentifiableEntityRepository } from "./repository.interface";

export interface IRaidBossRepository
  extends IIdentifiableEntityRepository<RaidBoss> {}

@EntityRepository()
export class RaidBossRepository
  extends IdentifiableEntityRepository<RaidBoss>
  implements IRaidBossRepository {}
