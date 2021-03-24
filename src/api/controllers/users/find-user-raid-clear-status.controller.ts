import {
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { FindUserRaidClearStatusService } from "@services/user/find-user-raid-clear-status.service";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

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
  async handleRequest(@Param("id") id: number) {
    try {
      return await this.findUserRaidClearStatus(id);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async findUserRaidClearStatus(id: number) {
    const clearedBosses = await this.findUserRaidClearService.find({ id });

    return {
      data: clearedBosses,
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
