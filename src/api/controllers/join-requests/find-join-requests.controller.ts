import { Get, JsonController, QueryParams } from "routing-controllers";
import { FindJoinRequestsService } from "@services/join-request/find-join-requests.service";
import { FindJoinRequestsQueryParams } from "./params/find-join-requests.params";
import { FindJoinRequestsResponse } from "./responses/find-join-requests.response";
import { mapJoinRequestToJoinRequestResponse } from "../../responses/entities/join-request.entity.response";

/**
 * Controller for GET /join-requests requests.
 * Returns all join requests that satisfy conditions set by optional query params (postId, roleId, userId)
 */
@JsonController()
export class FindJoinRequestsController {
  constructor(private readonly joinRequestService: FindJoinRequestsService) {}

  @Get("/join-requests")
  async find(
    @QueryParams() params: FindJoinRequestsQueryParams
  ): Promise<FindJoinRequestsResponse> {
    const requests = await this.joinRequestService.find(params);

    return { data: requests.map(mapJoinRequestToJoinRequestResponse) };
  }
}
