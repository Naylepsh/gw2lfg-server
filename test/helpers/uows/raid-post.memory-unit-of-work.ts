import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { ItemRequirementMemoryRepository } from "../repositories/item-requirements.memory-repository";
import { RaidBossMemoryRepository } from "../repositories/raid-boss.memory-repository";
import { RaidPostMemoryRepository } from "../repositories/raid-post.memory-repository";
import { RequirementMemoryRepository } from "../repositories/requirement.memory-repository";
import { RoleMemoryRepository } from "../repositories/role.memory-repository";
import { UserMemoryRepository } from "../repositories/user.memory-repository";

export class RaidPostMemoryUnitOfWork implements IRaidPostUnitOfWork {
  public committed = false;
  constructor(
    public users: UserMemoryRepository,
    public raidBosses: RaidBossMemoryRepository,
    public roles: RoleMemoryRepository,
    public requirements: RequirementMemoryRepository,
    public raidPosts: RaidPostMemoryRepository,
    public itemRequirements: ItemRequirementMemoryRepository
  ) {}

  async withTransaction<T>(work: () => T): Promise<T> {
    const res = await work();
    this.committed = true;
    return res;
  }

  async deleteAll() {
    await this.raidPosts.delete({});
    await this.users.delete({});
    await this.requirements.delete({});
    await this.roles.delete({});
    await this.raidBosses.delete({});
  }

  static create() {
    return new RaidPostMemoryUnitOfWork(
      new UserMemoryRepository(),
      new RaidBossMemoryRepository(),
      new RoleMemoryRepository(),
      new RequirementMemoryRepository(),
      new RaidPostMemoryRepository(),
      new ItemRequirementMemoryRepository()
    );
  }
}
