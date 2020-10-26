import { getRepository } from "typeorm";
import { IRepository } from "../../repository";
import { RaidBoss } from "../entities/raid-boss.entity";

export class RaidBossRepository implements IRepository<RaidBoss> {
  save(boss: RaidBoss): Promise<RaidBoss> {
    return this.getRepo().save(boss);
  }

  async findById(id: number): Promise<RaidBoss | null> {
    const boss = await this.getRepo().findOne(id);
    return boss ? boss : null;
  }

  private getRepo() {
    return getRepository(RaidBoss);
  }
}
