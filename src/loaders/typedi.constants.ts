/**
 * Contains constants needed for dependency injection for proper interface resolving.
 * In TypeScript interfaces are lost on compilation, thus a different way of preserving the 'identity' is needed,
 * hency why these strings.
 * You can read more about it in TypeDI documentation.
 */
export const types = {
  repositories: {
    user: "user.repository",
    role: "role.repository",
    requirement: "requirement.repository",
    itemRequirement: "item-requirement.repository",
    post: "post.repository",
    raidPost: "raid-post.repository",
    raidBoss: "raid-boss.repository",
    joinRequest: "join-request.repository",
  },
  uows: {
    raidPost: "raid-post.unit-of-work",
  },
  services: {
    requirementsCheck: "requirements-check.service",
    findRaidPosts: "find-raid-posts.service",
    findRaidPost: "find-raid-post.service",
    findAccount: "find-account.service",
    findRaidClearStatus: "find-raid-clear-status.service",
    findUserItems: "find-user-items.service",
    checkApiKeyValidity: "check-api-key.service",
    getItemsFromEntireAccountFetcher: "get-items-from-entire-account.fetcher",
  },
};

/**
 * Services constants
 * Services that implement interfaces have to be here, but for some reason
 * TypeDI has a problem resolving some concrete-class-only services that use injectable dependencies.
 * With trial and error, those are the services that need to be specially included for TypeDI
 */
export const requirementsCheckServiceType = "requirements-check.service";
export const findRaidPostsServiceType = "find-raid-posts.service";
export const findRaidPostServiceType = "find-raid-post.service";
export const findAccountServiceType = "find-account.service";
export const findRaidClearStatusServiceType = "find-raid-clear-status.service";
export const findUserItemsServiceType = "find-user-items.service";
export const checkApiKeyValidityServiceType = "check-api-key.service";
export const getItemsFromEntireAccountFetcherType =
  "get-items-from-entire-account.fetcher";
