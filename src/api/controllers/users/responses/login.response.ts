import { IRouteResponse } from "../../../responses/route.response.interface";

export interface LoginResponse extends IRouteResponse<{ token: string }> {}
