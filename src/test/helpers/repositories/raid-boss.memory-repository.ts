import { RaidBoss } from "../../../entities/raid-boss.entity";
import { IRaidBossRepository } from "../../../repositories/raid-boss.repository";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RaidBossMemoryRepository
  extends IdentifiableMemoryRepository<RaidBoss>
  implements IRaidBossRepository {}
