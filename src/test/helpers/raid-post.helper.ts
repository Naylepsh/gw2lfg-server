import { RaidPost } from "../../entities/raid-post.entitity";
import { User } from "../../entities/user.entity";
import { IRaidPostRepository } from "../../repositories/raid-post.repository";

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
