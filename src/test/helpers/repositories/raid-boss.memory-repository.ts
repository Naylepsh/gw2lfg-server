import { RaidBoss } from "../../../core/entities/raid-boss.entity";
import { IRaidBossRepository } from "../../../core/repositories/raid-boss.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RaidBossMemoryRepository
  extends IdentifiableMemoryRepository<RaidBoss>
  implements IRaidBossRepository {}
