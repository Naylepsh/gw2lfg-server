import { FindRaidPostController } from "./find-raid-post.controller";
import { FindRaidPostsController } from "./find-raid-posts.controller";
import { PublishRaidPostController } from "./publish-raid-post.controller";
import { UnpublishRaidPostController } from "./unpublish.controller";
import { UpdateRaidPostController } from "./update-raid-post.controller";

// Available raid posts controllers
export const raidPostsControllers = [
  FindRaidPostController,
  FindRaidPostsController,
  PublishRaidPostController,
  UnpublishRaidPostController,
  UpdateRaidPostController,
];
