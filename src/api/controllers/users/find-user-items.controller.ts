import {
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { FindUserItemsService } from "@services/user/find-user-items.service";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for GET /users/:id/items requests.
 * Returns items of an user with matching id.
 */
@JsonController()
export class FindUserItemsController {
  constructor(private readonly findUserItemsService: FindUserItemsService) {}

  @Get("/users/:id/items")
  async handleRequest(@Param("id") id: number) {
    try {
      return await this.findUserItems(id);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async findUserItems(id: number) {
    const items = await this.findUserItemsService.find({ id });

    return {
      data: items,
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
