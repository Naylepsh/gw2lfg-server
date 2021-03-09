import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";

/**
 * Adds property { userMeetsRequirements: false } to each of the given posts
 */
export function unsatisfyEachRequirement(posts: RaidPost[]) {
  const _posts = posts.map((post) => ({
    ...post,
    userMeetsRequirements: false,
  }));

  return _posts;
}
