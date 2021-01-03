import { RaidPost } from "@data/entities/raid-post.entitity";

export function unsatisfyEachRequirement(posts: RaidPost[]) {
  const _posts = posts.map((post) => ({
    ...post,
    userMeetsRequirements: false,
  }));

  return _posts;
}
