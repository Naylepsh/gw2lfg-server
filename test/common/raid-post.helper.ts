import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { User } from "@root/data/entities/user/user.entity";
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
