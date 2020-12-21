import { joinRequestControllers } from "./join-requests";
import { raidPostControllers } from "./raid-posts";
import { userControllers } from "./users";

export const controllers = [
  ...joinRequestControllers,
  ...raidPostControllers,
  ...userControllers,
];
