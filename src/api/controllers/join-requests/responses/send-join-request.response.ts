import { IRouteResponse } from "../../../responses/route.response.interface";
import { JoinRequest } from "@data/entities/join-request.entity";

export interface SendJoinRequestResponse extends IRouteResponse<JoinRequest> {}
