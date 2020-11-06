import { RaidBoss } from "../../../entities/raid-boss.entity";
import { IRaidBossRepository } from "../../../repositories/raid-boss.repository";
import { MemoryRepository } from "./memory-repository";

export class RaidBossMemoryRepository
  extends MemoryRepository<RaidBoss>
  implements IRaidBossRepository {}
