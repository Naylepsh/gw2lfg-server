import { IRaidPostUnitOfWork } from "../../repositories/raid-post.unit-of-work";

export interface UnpublishRaidPostDTO {
  id: number;
}

export const unpublish = async (
  unpublishDto: UnpublishRaidPostDTO,
  uow: IRaidPostUnitOfWork
) => {
  return uow.withTransaction(async () => {
    const post = await uow.raidPosts.findById(unpublishDto.id);
    if (!post) return;

    await uow.requirements.delete(post.requirements.map((r) => r.id));
    await uow.roles.delete(post.roles.map((r) => r.id));

    await uow.raidPosts.delete(post.id);
  });
};
