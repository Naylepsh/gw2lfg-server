import { RaidPostResponse } from "../../../responses/entities/raid-post.entity.response";
import { IRouteResponse } from "../../../responses/route.response.interface";

export interface FindRaidPostsResponse
  extends IRouteResponse<
    RaidPostResponse[]
  > {
  hasMore: boolean;
}
