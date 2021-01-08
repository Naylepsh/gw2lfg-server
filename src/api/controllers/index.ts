import { joinRequestsControllers } from "./join-requests";
import { raidBossesControllers } from "./raid-bosses";
import { raidPostsControllers } from "./raid-posts";
import { usersControllers } from "./users";

// Available controllers
export const controllers = [
  ...joinRequestsControllers,
  ...raidPostsControllers,
  ...usersControllers,
  ...raidBossesControllers,
];
