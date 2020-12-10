import { joinRequestControllers } from "./join-request";
import { raidPostControllers } from "./raid-post";
import { userControllers } from "./user";

export const controllers = [
  ...joinRequestControllers,
  ...raidPostControllers,
  ...userControllers,
];
