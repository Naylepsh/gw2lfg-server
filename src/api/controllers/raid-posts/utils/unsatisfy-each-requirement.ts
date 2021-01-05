import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";

export function unsatisfyEachRequirement(posts: RaidPost[]) {
  const _posts = posts.map((post) => ({
    ...post,
    userMeetsRequirements: false,
  }));

  return _posts;
}
