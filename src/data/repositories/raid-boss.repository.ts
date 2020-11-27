import { EntityRepository } from "typeorm";
import { RaidBoss } from "../../core/entities/raid-boss.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IRaidBossRepository } from "../../core/repositories/raid-boss.repository.interface";

@EntityRepository()
export class RaidBossRepository
  extends IdentifiableEntityRepository<RaidBoss>
  implements IRaidBossRepository {}
