/* 
Contains constants needed for dependency injection for proper interface resolving.
In TypeScript interfaces are lost on compilation, thus a different way of preserving the 'identity' is needed,
hency why these string.
You can read more about it in TypeDI documentation.
*/

// Repository interfaces constants
export const userRepositoryType = "user.repository";
export const roleRepositoryType = "role.repository";
export const requirementRepositoryType = "requirement.repository";
export const itemRequirementRepositoryType = "item-requirement.repository";
export const postRepositoryType = "post.repository";
export const raidPostRepositoryType = "raid-post.repository";
export const raidBossRepositoryType = "raid-boss.repository";
export const joinRequestRepositoryType = "join-request.repository";

// Units of work constants
export const raidPostUnitOfWorkType = "raid-post.unit-of-work";

/* 
Services constants
Services that implement interfaces have to be here, but for some reason
TypeDI has a problem resolving some concrete-class-only services that use injectable dependencies. 
With trial and error, those are the services that need to be specially included for TypeDI
*/
export const requirementsCheckServiceType = "requirements-check.service";
export const findRaidPostsServiceType = "find-raid-posts.service";
export const findRaidPostServiceType = "find-raid-post.service";
export const findAccountServiceType = "find-account.service";
export const checkApiKeyValidityServiceType = "check-api-key.service";
export const getItemsFromEntireAccountFetcherType =
  "get-items-from-entire-account.fetcher";
