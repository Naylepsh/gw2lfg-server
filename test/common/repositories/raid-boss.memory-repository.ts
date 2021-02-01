import { RaidBoss } from "@root/data/entities/raid-boss/raid-boss.entity";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RaidBossMemoryRepository
  extends IdentifiableMemoryRepository<RaidBoss>
  implements IRaidBossRepository {}
