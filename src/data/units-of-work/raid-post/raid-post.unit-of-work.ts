import { RaidBossRepository } from "../../repositories/raid-boss/raid-boss.repository";
import { RaidPostRepository } from "../../repositories/raid-post/raid-post.repository";
import { RequirementRepository } from "../../repositories/requirement/requirement.repository";
import { RoleRepository } from "../../repositories/role/role.repository";
import { UserRepository } from "../../repositories/user/user.repository";
import { IRaidPostUnitOfWork } from "./raid-post.unit-of-work.interface";
import { TypeOrmUnitOfWork } from "../generic.unit-of-work";

export class RaidPostUnitOfWork implements IRaidPostUnitOfWork {
  private constructor(private unitOfWork: TypeOrmUnitOfWork) {}
  withTransaction<T>(work: () => T): Promise<T> {
    return this.unitOfWork.withTransaction(work);
  }

  get users() {
    return this.unitOfWork.getCustomRepository(UserRepository);
  }

  get raidBosses() {
    return this.unitOfWork.getCustomRepository(RaidBossRepository);
  }

  get requirements() {
    return this.unitOfWork.getCustomRepository(RequirementRepository);
  }

  get roles() {
    return this.unitOfWork.getCustomRepository(RoleRepository);
  }

  get raidPosts() {
    return this.unitOfWork.getCustomRepository(RaidPostRepository);
  }
}
