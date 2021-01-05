import { Get, JsonController, QueryParams } from "routing-controllers";
import { FindJoinRequestsService } from "@services/join-request/find-join-requests.service";
import { FindJoinRequestsParams } from "./params/find-join-requests.params";
import { FindJoinRequestsResponse } from "./responses/find-join-requests.response";
import { mapJoinRequestToJoinRequestResponse } from "../../responses/entities/join-request.entity.response";

@JsonController()
export class FindJoinRequestsController {
  constructor(private readonly joinRequestService: FindJoinRequestsService) {}

  @Get("/join-requests")
  async find(
    @QueryParams() params: FindJoinRequestsParams
  ): Promise<FindJoinRequestsResponse> {
    console.log("hi domo?!");
    const requests = await this.joinRequestService.find(params);
    return { data: requests.map(mapJoinRequestToJoinRequestResponse) };
  }
}
