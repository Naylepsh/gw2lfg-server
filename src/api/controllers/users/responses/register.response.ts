import { IRouteResponse } from "../../../responses/route.response.interface";

export interface RegisterResponse extends IRouteResponse<{ token: string }> {}
