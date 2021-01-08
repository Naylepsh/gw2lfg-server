import { Inject, Service } from "typedi";
import { raidBossRepositoryType } from "@loaders/typedi.constants";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";

@Service()
export class FindRaidBossesService {
  constructor(
    @Inject(raidBossRepositoryType)
    private readonly repository: IRaidBossRepository
  ) {}

  async find() {
    const bosses = await this.repository.findMany({
      order: { id: "ASC" },
    });

    return bosses;
  }
}
