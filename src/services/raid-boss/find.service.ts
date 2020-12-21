import { Inject, Service } from "typedi";
import { raidBossRepositoryType } from "@loaders/typedi.constants";
import { IRaidBossRepository } from "../../data/repositories/raid-boss/raid-boss.repository.interface";

export interface FindRaidBossParams {
  skip: number;
  take: number;
}

@Service()
export class FindRaidBossService {
  constructor(
    @Inject(raidBossRepositoryType)
    private readonly repository: IRaidBossRepository
  ) {}

  async find(params: FindRaidBossParams) {
    const { skip, take } = params;

    const bosses = await this.repository.findMany({
      order: { id: "ASC" },
      skip,
      take: take + 1,
    });

    if (bosses.length === 0) {
      return { bosses, hasMore: false };
    }
    return {
      bosses: bosses.slice(0, take),
      hasMore: bosses.length === take + 1,
    };
  }
}
