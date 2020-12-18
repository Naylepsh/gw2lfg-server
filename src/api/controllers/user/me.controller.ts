import { CurrentUser, Get, JsonController } from "routing-controllers";
import { User } from "@data/entities/user.entity";
import { mapUserToUserReponse } from "../../responses/user.response";

@JsonController()
export class MeController {
  @Get("/me")
  me(@CurrentUser({ required: true }) user: User) {
    return mapUserToUserReponse(user);
  }
}
