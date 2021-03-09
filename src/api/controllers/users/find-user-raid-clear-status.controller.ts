import {
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { FindUserRaidClearStatusService } from "@services/user/find-user-raid-clear-status.service";

/**
 * Controller for GET /users/:id/raid-clear requests.
 * Returns a list of bosses cleared since weekly reset of an user with matching id.
 */
@JsonController()
export class FindUserRaidClearStatusController {
  constructor(
    private readonly findUserRaidClearService: FindUserRaidClearStatusService
  ) {}

  @Get("/users/:id/raid-clear")
  async find(@Param("id") id: number) {
    try {
      const clearedBosses = await this.findUserRaidClearService.find({ id });

      return {
        data: clearedBosses,
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
