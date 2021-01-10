import { Inject, Service } from "typedi";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { In, LessThanOrEqual } from "typeorm";

/*
Service for deletion of raid posts which scheduled date is in the past
*/
@Service()
export class DeleteOldPostsService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async deleteOldPosts() {
    return this.uow.withTransaction(async () => {
      // find all posts such that their date < now
      const posts = await this.uow.raidPosts.findMany({
        where: { date: LessThanOrEqual(new Date()) },
        relations: ["requirements", "roles"],
      });
      const postsIds = posts.map((post) => post.id);

      // find and remove all of their join requests
      if (posts.length > 0) {
        const joinRequests = await this.uow.joinRequests.findMany({
          where: { post: { id: In(postsIds) } },
          relations: ["post"],
        });
        const joinRequestsIds = joinRequests.map((request) => request.id);
        if (joinRequestsIds.length > 0) {
          await this.uow.joinRequests.delete(joinRequestsIds);
        }
      }

      // find and remove all of their requirements
      const requirements = posts.map((post) => post.requirements).flat();
      const requirementsIds = requirements.map((requirement) => requirement.id);
      if (requirementsIds.length > 0) {
        await this.uow.requirements.delete(requirementsIds);
      }

      // find and remove all of their roles
      const roles = posts.map((post) => post.roles).flat();
      const rolesIds = roles.map((role) => role.id);
      if (rolesIds.length > 0) {
        await this.uow.roles.delete(rolesIds);
      }

      // remove posts
      if (postsIds.length > 0) {
        await this.uow.raidPosts.delete(postsIds);
      }

      return;
    });
  }
}
