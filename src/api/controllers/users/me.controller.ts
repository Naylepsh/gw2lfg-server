import { CurrentUser, Get, JsonController } from "routing-controllers";
import { User } from "@data/entities/user.entity";
import { mapUserToUserReponse, UserResponse } from "../../responses/entities/user.entity.response";
import { IRouteResponse } from "../../responses/routes/route.response.interface";

interface MeResponse extends IRouteResponse<UserResponse> {}

@JsonController()
export class MeController {
  @Get("/me")
  me(@CurrentUser({ required: true }) user: User): MeResponse {
    const userResponse = mapUserToUserReponse(user)
    return { data: { ...userResponse }}
  }
}
