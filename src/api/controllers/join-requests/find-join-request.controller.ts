import {
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { FindJoinRequestService } from "@services/join-request/find-join-request.service";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { FindJoinRequestResponse } from "./responses/find-join-request.response";
import { mapJoinRequestToJoinRequestResponse } from "../../responses/entities/join-request.entity.response";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for GET /join-request/:id requests.
 * Returns a join request with matching id.
 */
@JsonController()
export class FindJoinRequestController {
  constructor(private readonly joinRequestService: FindJoinRequestService) {}

  @Get("/join-requests/:id")
  async handleRequest(
    @Param("id") id: number
  ): Promise<FindJoinRequestResponse> {
    try {
      return await this.findJoinRequest(id);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundError(message);
    } else {
      throw new InternalServerError(message);
    }
  }

  private async findJoinRequest(id: number) {
    const request = await this.joinRequestService.find({ id });

    return { data: mapJoinRequestToJoinRequestResponse(request) };
  }
}
