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

/*
Controller for PUT /join-requests/:id requests.
Updates the status of a post with given id.
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
      const canChangeStatus = await this.joinRequestPermissionService.canUserChangeJoinRequestStatus(
        { userId: user.id, joinRequestId: id }
      );
      if (!canChangeStatus) {
        throw new ForbiddenError();
      }

      const joinRequest = await this.joinRequestService.updateStatus({
        id,
        newStatus: dto.status,
      });

      return { data: joinRequest };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundError(e.message);
      } else {
        throw e;
      }
    }
  }
}
