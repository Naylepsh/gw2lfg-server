import { IRouteResponse } from "../../responses/routes/route.response.interface";

export interface RegisterResponse extends IRouteResponse<{ token: string }> {}
