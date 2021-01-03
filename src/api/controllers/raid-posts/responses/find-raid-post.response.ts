import { RaidPostResponse } from "../../../responses/entities/raid-post.entity.response";
import { IRouteResponse } from "../../../responses/route.response.interface";

export interface FindRaidPostResponse
  extends IRouteResponse<
    RaidPostResponse & { userMeetsRequirements: boolean }
  > {}
