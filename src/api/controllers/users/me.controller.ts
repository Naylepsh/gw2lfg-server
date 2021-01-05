import { CurrentUser, Get, JsonController } from "routing-controllers";
import { User } from "@root/data/entities/user/user.entity";
import { mapUserToUserReponse } from "../../responses/entities/user.entity.response";
import { MeResponse } from "./responses/me.response";

@JsonController()
export class MeController {
  @Get("/me")
  me(@CurrentUser({ required: true }) user: User): MeResponse {
    return { data: mapUserToUserReponse(user) };
  }
}
