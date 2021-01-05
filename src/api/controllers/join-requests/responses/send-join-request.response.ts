import { IRouteResponse } from "../../../responses/route.response.interface";
import { JoinRequest } from "@root/data/entities/join-request/join-request.entity";

export interface SendJoinRequestResponse extends IRouteResponse<JoinRequest> {}
