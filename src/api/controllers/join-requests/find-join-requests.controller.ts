import { Get, JsonController, QueryParams } from "routing-controllers";
import { FindJoinRequestsService } from "@services/join-request/find-join-requests.service";
import { FindJoinRequestsDTO } from "./dtos/find-join-requests.dto";
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
  async handleRequest(
    @QueryParams() query: FindJoinRequestsDTO
  ): Promise<FindJoinRequestsResponse> {
    const requests = await this.joinRequestService.find(query);

    return { data: requests.map(mapJoinRequestToJoinRequestResponse) };
  }
}
