import { Inject, Service } from "typedi";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { In } from "typeorm";
import { byIds } from "@data/queries/common/by-ids.query";

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
      const postsIds = posts.map((post) => post.id);

      await this.removeJoinRequestsToPosts(postsIds);
      await this.removeRequirementsOfPosts(postsIds);
      await this.removeRolesOfPosts(postsIds);

      await this.removePosts(postsIds);
    });
  }

  // finds all posts such that their date < now
  private getOldPosts() {
    const now = new Date();
    return this.uow.raidPosts.findMany({
      where: { maxDate: now },
    });
  }

  private async removeJoinRequestsToPosts(postsIds: number[]) {
    if (postsIds.length > 0) {
      await this.uow.joinRequests.delete({ post: { id: In(postsIds) } });
    }
  }

  private async removeRequirementsOfPosts(postsIds: number[]) {
    if (postsIds.length > 0) {
      await this.uow.requirements.delete({ post: { id: In(postsIds) } });
    }
  }

  private async removeRolesOfPosts(postsIds: number[]) {
    if (postsIds.length > 0) {
      await this.uow.roles.delete({ post: { id: In(postsIds) } });
    }
  }

  private async removePosts(postsIds: number[]) {
    if (postsIds.length > 0) {
      await this.uow.raidPosts.delete(byIds(postsIds));
    }
  }
}
