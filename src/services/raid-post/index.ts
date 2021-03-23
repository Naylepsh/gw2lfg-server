import { CheckPostAuthorshipService } from "./check-post-authorship.service";
import { DeleteOldPostsService } from "./delete-old-posts.service";
import { FindRaidPostService } from "./find-raid-post.service";
import { FindRaidPostsService } from "./find-raid-posts.service";
import { CreateRaidPostService } from "./create-raid-post.service";
import { DeleteRaidPostService } from "./delete-raid-post.service";
import { UpdateRaidPostService } from "./update-raid-post.service";

// Available raid posts services
export default {
  CheckPostAuthorshipService,
  FindRaidPostService,
  FindRaidPostsService,
  CreateRaidPostService,
  DeleteRaidPostService,
  UpdateRaidPostService,
  DeleteOldPostsService,
};
