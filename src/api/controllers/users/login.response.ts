import { IRouteResponse } from "../../responses/routes/route.response.interface";

export interface LoginResponse extends IRouteResponse<{ token: string }> {}
