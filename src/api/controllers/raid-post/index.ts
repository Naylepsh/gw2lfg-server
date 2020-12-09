import { FindRaidPostsController } from "./find.controller";
import { PublishRaidPostController } from "./publish.controller";
import { UnpublishRaidPostController } from "./unpublish.controller";
// import { UpdateRaidPostController } from "./update.controller";

export const raidPostControllers = [
  FindRaidPostsController,
  PublishRaidPostController,
  UnpublishRaidPostController,
  // UpdateRaidPostController,
];
