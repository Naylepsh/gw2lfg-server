import { CurrentUser, Get, JsonController } from "routing-controllers";
import { User } from "@root/data/entities/user/user.entity";
import { mapUserToUserResponse } from "../../responses/entities/user.entity.response";
import { MeResponse } from "./responses/me.response";

/*
Controller for GET /me
Returns an user associated with sent jwt.
User has to be authenticated to use.
*/
@JsonController()
export class MeController {
  // user is provided by auth middlewere
  @Get("/me")
  me(@CurrentUser({ required: true }) user: User): MeResponse {
    return { data: mapUserToUserResponse(user) };
  }
}
