import { RaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { IRouteResponse } from "../../responses/routes/route.response.interface";

/* TODO (maybe):
use something like
{
  pagination: {
    skip: ??
    take: ??
    total: ??
  },
  data: [...],
  links: {
    prev: ??,
    next: ??
  }
}
*/
export interface FindRaidPostsResponse
  extends IRouteResponse<
    (RaidPostResponse & { userMeetsRequirements: boolean })[]
  > {
  hasMore: boolean;
}
