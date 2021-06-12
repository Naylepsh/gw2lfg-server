import { Inject, Service } from "typedi";
import { types } from "@loaders/typedi.constants";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";
import { all } from "@root/data/queries/common.queries";

/**
 * Service for finding all raid bosses.
 * Sorts results by id.
 */
@Service()
export class FindRaidBossesService {
  constructor(
    @Inject(types.repositories.raidBoss)
    private readonly repository: IRaidBossRepository
  ) {}

  async find() {
    const bosses = await this.repository.findMany(all());

    return bosses;
  }
}
