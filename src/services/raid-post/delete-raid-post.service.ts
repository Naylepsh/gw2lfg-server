import { Inject, Service } from "typedi";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { types } from "@loaders/typedi.constants";
import { UnpublishRaidPostDTO } from "./dtos/delete-raid-post.dto";
import { byId } from "@root/data/queries/common.queries";

/**
 * Service for deletion of raid posts.
 */
@Service()
export class DeleteRaidPostService {
  constructor(
    @Inject(types.uows.raidPost) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async delete(dto: UnpublishRaidPostDTO) {
    return this.uow.withTransaction(async () => {
      const post = await this.uow.raidPosts.findOne(byId(dto.id));
      if (!post) return;

      await this.uow.joinRequests.delete({ post: { id: post.id } });

      if (post.hasRequirements()) {
        await this.uow.requirements.delete(post.requirements.map((r) => r.id));
      }

      if (post.hasRoles()) {
        await this.uow.roles.delete(post.roles.map((r) => r.id));
      }

      await this.uow.raidPosts.delete(byId(post.id));
    });
  }
}
