import {
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { FindUserService } from "@services/user/find-user.service";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { mapUserToUserResponse } from "../../responses/entities/user.entity.response";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for GET /users/:id requests.
 * Returns an user with matching id and their gw2 account on success.
 */
@JsonController()
export class FindUserController {
  constructor(private readonly findUserService: FindUserService) {}

  @Get("/users/:id")
  async handleRequest(@Param("id") id: number) {
    try {
      return await this.findUser(id);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async findUser(id: number) {
    const { user, account } = await this.findUserService.find({ id });

    return {
      data: {
        user: mapUserToUserResponse(user),
        account,
      },
    };
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundError();
    } else {
      throw new InternalServerError(message);
    }
  }
}
