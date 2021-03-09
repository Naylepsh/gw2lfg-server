import { RaidBossRepository } from "../../repositories/raid-boss/raid-boss.repository";
import { RaidPostRepository } from "../../repositories/raid-post/raid-post.repository";
import { RequirementRepository } from "../../repositories/requirement/requirement.repository";
import { RoleRepository } from "../../repositories/role/role.repository";
import { UserRepository } from "../../repositories/user/user.repository";
import { ItemRequirementRepository } from "../../repositories/item-requirement/item-requirement.repository";
import { IRaidPostUnitOfWork } from "./raid-post.unit-of-work.interface";
import { GenericUnitOfWork } from "../generic.unit-of-work";
import { Inject, Service } from "typedi";
import { raidPostUnitOfWorkType } from "../../../loaders/typedi.constants";
import { JoinRequestRepository } from "../../repositories/join-request/join-request.repository";

/**
 * Extension over GenericUoW for raid-post-oriented operations.
 * Allows retrieval of raid post and raid post's relations related repositiories
 * and operations on them within transaction.
 */
@Service(raidPostUnitOfWorkType)
export class RaidPostUnitOfWork implements IRaidPostUnitOfWork {
  public constructor(
    @Inject() private readonly unitOfWork: GenericUnitOfWork
  ) {}

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

  get itemRequirements() {
    return this.unitOfWork.getCustomRepository(ItemRequirementRepository);
  }

  get roles() {
    return this.unitOfWork.getCustomRepository(RoleRepository);
  }

  get raidPosts() {
    return this.unitOfWork.getCustomRepository(RaidPostRepository);
  }

  get joinRequests() {
    return this.unitOfWork.getCustomRepository(JoinRequestRepository);
  }
}
