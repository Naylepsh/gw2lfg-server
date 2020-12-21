import { FindRaidPostsController } from "./find.controller";
import { PublishRaidPostController } from "./publish.controller";
import { UnpublishRaidPostController } from "./unpublish.controller";
import { UpdateRaidPostController } from "./update.controller";

export const raidPostsControllers = [
  FindRaidPostsController,
  PublishRaidPostController,
  UnpublishRaidPostController,
  UpdateRaidPostController,
];
