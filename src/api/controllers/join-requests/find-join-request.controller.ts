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

/*
Controller for GET /join-request/:id requests.
Returns a join request with matching id.
*/
@JsonController()
export class FindJoinRequestController {
  constructor(private readonly joinRequestService: FindJoinRequestService) {}

  @Get("/join-requests/:id")
  async find(@Param("id") id: number): Promise<FindJoinRequestResponse> {
    try {
      const request = await this.joinRequestService.find({ id });

      return { data: mapJoinRequestToJoinRequestResponse(request) };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError(error.message);
      } else {
        throw new InternalServerError(error.message);
      }
    }
  }
}
