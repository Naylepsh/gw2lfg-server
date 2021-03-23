import { FindRaidPostController } from "./find-raid-post.controller";
import { FindRaidPostsController } from "./find-raid-posts.controller";
import { CreateRaidPostController } from "./create-raid-post.controller";
import { DeleteRaidPostController } from "./delete-raid-post.controller";
import { UpdateRaidPostController } from "./update-raid-post.controller";

// Available raid posts controllers
export const raidPostsControllers = [
  FindRaidPostController,
  FindRaidPostsController,
  CreateRaidPostController,
  DeleteRaidPostController,
  UpdateRaidPostController,
];
