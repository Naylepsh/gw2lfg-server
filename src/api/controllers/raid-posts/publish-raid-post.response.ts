import { RaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { IRouteResponse } from "../../responses/routes/route.response.interface";

export interface PublishRaidPostResponse
  extends IRouteResponse<RaidPostResponse> {}
