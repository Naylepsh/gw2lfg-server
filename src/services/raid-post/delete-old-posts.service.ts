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

  // finds all posts such that their date < now
  private getOldPosts() {
    return this.uow.raidPosts.findMany({
      where: { date: LessThanOrEqual(new Date()) },
      relations: ["requirements", "roles"],
    });
  }

  private async removeJoinRequestsToPosts(posts: RaidPost[]) {
    if (posts.length > 0) {
      const postsIds = posts.map((post) => post.id);
      await this.uow.joinRequests.delete({ post: { id: In(postsIds) } });
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
