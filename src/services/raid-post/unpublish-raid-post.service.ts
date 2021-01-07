import { Inject, Service } from "typedi";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { UnpublishRaidPostDTO } from "./dtos/unpublish-raid-post.dto";

@Service()
export class UnpublishRaidPostService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async unpublish(dto: UnpublishRaidPostDTO) {
    return this.uow.withTransaction(async () => {
      const post = await this.uow.raidPosts.findById(dto.id);
      if (!post) return;

      await this.uow.joinRequests.delete({ post: { id: post.id } });

      if (post.hasRequirements()) {
        await this.uow.requirements.delete(post.requirements.map((r) => r.id));
      }

      if (post.hasRoles()) {
        await this.uow.roles.delete(post.roles.map((r) => r.id));
      }

      await this.uow.raidPosts.delete(post.id);
    });
  }
}
