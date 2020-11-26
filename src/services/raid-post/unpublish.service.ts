import { IRaidPostUnitOfWork } from "../../repositories/raid-post.unit-of-work";

export interface UnpublishRaidPostDTO {
  id: number;
}

export class UnpublishRaidPostService {
  constructor(private readonly uow: IRaidPostUnitOfWork) {}

  async unpublish(dto: UnpublishRaidPostDTO) {
    return this.uow.withTransaction(async () => {
      const post = await this.uow.raidPosts.findById(dto.id);
      if (!post) return;

      await this.uow.requirements.delete(post.requirements.map((r) => r.id));
      await this.uow.roles.delete(post.roles.map((r) => r.id));

      await this.uow.raidPosts.delete(post.id);
    });
  }
}
