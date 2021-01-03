import { UserResponse } from "../../../responses/entities/user.entity.response";
import { IRouteResponse } from "../../../responses/route.response.interface";

export interface MeResponse extends IRouteResponse<UserResponse> {}
