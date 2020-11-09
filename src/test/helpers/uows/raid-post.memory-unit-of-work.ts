import { IRaidPostUnitOfWork } from "../../../repositories/raid-post.unit-of-work";
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
    public raidPosts: RaidPostMemoryRepository
  ) {}

  async withTransaction<T>(work: () => T): Promise<T> {
    const res = await work();
    this.committed = true;
    return res;
  }
}
