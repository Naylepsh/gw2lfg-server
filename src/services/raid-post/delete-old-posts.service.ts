import { Inject, Service } from "typedi";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { In, LessThanOrEqual } from "typeorm";

/**
 * Service for deletion of raid posts which scheduled date is in the past
 */
@Service()
export class DeleteOldPostsService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async deleteOldPosts() {
    return this.uow.withTransaction(async () => {
      const posts = await this.getOldPosts();

      await this.removeJoinRequestsToPosts(posts);
      await this.removeRequirementsOfPosts(posts);
      await this.removeRolesOfPosts(posts);

      await this.removePosts(posts);
    });
  }

  // find all posts such that their date < now
  private async getOldPosts() {
    return await this.uow.raidPosts.findMany({
      where: { date: LessThanOrEqual(new Date()) },
      relations: ["requirements", "roles"],
    });
  }

  // TODO: refactor (just delete in one step instead of finding first)
  private async removeJoinRequestsToPosts(posts: RaidPost[]) {
    if (posts.length > 0) {
      const postsIds = posts.map((post) => post.id);
      const joinRequests = await this.uow.joinRequests.findMany({
        where: { post: { id: In(postsIds) } },
        relations: ["post"],
      });

      const joinRequestsIds = joinRequests.map((request) => request.id);
      if (joinRequestsIds.length > 0) {
        await this.uow.joinRequests.delete(joinRequestsIds);
      }
    }
  }

  private async removeRequirementsOfPosts(posts: RaidPost[]) {
    const requirements = posts.map((post) => post.requirements).flat();
    const requirementsIds = requirements.map((requirement) => requirement.id);
    if (requirementsIds.length > 0) {
      await this.uow.requirements.delete(requirementsIds);
    }
  }

  private async removeRolesOfPosts(posts: RaidPost[]) {
    const roles = posts.map((post) => post.roles).flat();
    const rolesIds = roles.map((role) => role.id);
    if (rolesIds.length > 0) {
      await this.uow.roles.delete(rolesIds);
    }
  }

  private async removePosts(posts: RaidPost[]) {
    const postsIds = posts.map((post) => post.id);
    if (postsIds.length > 0) {
      await this.uow.raidPosts.delete(postsIds);
    }
  }
}
