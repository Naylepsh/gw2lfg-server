import {
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { FindUserItemsService } from "@services/user/find-user-items.service";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";

/**
 * Controller for GET /users/:id/items requests.
 * Returns items of an user with matching id.
*/
@JsonController()
export class FindUserItemsController {
  constructor(private readonly findUserItemsService: FindUserItemsService) {}

  @Get("/users/:id/items")
  async find(@Param("id") id: number) {
    try {
      const items = await this.findUserItemsService.find({ id });

      return {
        data: items,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError();
      } else {
        throw new InternalServerError(error.message);
      }
    }
  }
}
