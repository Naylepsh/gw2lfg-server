import {
  Body,
  CurrentUser,
  ForbiddenError,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Put,
} from "routing-controllers";
import { User } from "@data/entities/user/user.entity";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { UpdateJoinRequestStatusService } from "@services/join-request/update-join-request-status.service";
import { CheckJoinRequestStatusChangePermissionService } from "@services/join-request/check-join-request-status-change-permission.service";
import { SendJoinRequestResponse } from "./responses/send-join-request.response";
import { UpdateJoinRequestDTO } from "./dtos/update-join-request.dto";
import { mapJoinRequestToJoinRequestResponse } from "../../responses/entities/join-request.entity.response";

/*
Controller for PUT /join-requests/:id requests.
Updates the status of a post with given id.
Status can be changed only by the post's author that the request points to.
User has to be authenticated to use this route.
*/
@JsonController()
export class UpdateJoinRequestController {
  constructor(
    private readonly joinRequestService: UpdateJoinRequestStatusService,
    private readonly joinRequestPermissionService: CheckJoinRequestStatusChangePermissionService
  ) {}

  @HttpCode(201)
  @Put("/join-requests/:id")
  async sendJoinRequest(
    @CurrentUser({ required: true }) user: User,
    @Param("id") id: number,
    @Body() dto: UpdateJoinRequestDTO
  ): Promise<SendJoinRequestResponse> {
    try {
      const canChangeStatus = await this.joinRequestPermissionService.canUserChangeStatus(
        { userId: user.id, joinRequestId: id }
      );
      if (!canChangeStatus) {
        throw new ForbiddenError();
      }

      const joinRequest = await this.joinRequestService.updateStatus({
        id,
        newStatus: dto.status,
      });

      return { data: mapJoinRequestToJoinRequestResponse(joinRequest) };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundError(e.message);
      } else {
        throw e;
      }
    }
  }
}
