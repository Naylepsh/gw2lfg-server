import { IRouteResponse } from "../../../responses/route.response.interface";
import { JoinRequestResponse } from "../../../responses/entities/join-request.entity.response";

export interface SendJoinRequestResponse
  extends IRouteResponse<JoinRequestResponse> {}
