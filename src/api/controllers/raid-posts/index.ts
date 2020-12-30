import { FindRaidPostsController } from "./find-raid-posts.controller";
import { PublishRaidPostController } from "./publish-raid-post.controller";
import { UnpublishRaidPostController } from "./unpublish.controller";
import { UpdateRaidPostController } from "./update-raid-post.controller";

export const raidPostsControllers = [
  FindRaidPostsController,
  PublishRaidPostController,
  UnpublishRaidPostController,
  UpdateRaidPostController,
];
