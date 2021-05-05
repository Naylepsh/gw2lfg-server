import { Inject, Service } from "typedi";
import { raidBossRepositoryType } from "@loaders/typedi.constants";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";

/**
 * Service for finding all raid bosses.
 * Sorts results by id.
 */
@Service()
export class FindRaidBossesService {
  constructor(
    @Inject(raidBossRepositoryType)
    private readonly repository: IRaidBossRepository
  ) {}

  async find() {
    const bosses = await this.repository.findMany({});

    return bosses;
  }
}
