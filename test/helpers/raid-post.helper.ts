import { RaidPost } from "@data/entities/raid-post.entitity";
import { User } from "@data/entities/user.entity";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";

export const createAndSaveRaidPost = (
  repo: IRaidPostRepository,
  author: User,
  raidPost: Partial<RaidPost>
) => {
  const post = new RaidPost({
    author,
    date: raidPost.date ?? new Date(),
    server: raidPost.server ?? "EU",
    bosses: raidPost.bosses ?? [],
    requirements: raidPost.requirements ?? [],
    roles: raidPost.roles ?? [],
  });
  return repo.save(post);
};
