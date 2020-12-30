import { CurrentUser, Get, JsonController } from "routing-controllers";
import { User } from "@data/entities/user.entity";
import { mapUserToUserReponse } from "../../responses/entities/user.entity.response";
import { MeResponse } from "./me.response";

@JsonController()
export class MeController {
  @Get("/me")
  me(@CurrentUser({ required: true }) user: User): MeResponse {
    const userResponse = mapUserToUserReponse(user);
    return { data: { ...userResponse } };
  }
}
