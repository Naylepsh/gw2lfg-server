import {
  Body,
  CurrentUser,
  ForbiddenError,
  HttpCode,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Put,
} from "routing-controllers";
import { User } from "@data/entities/user/user.entity";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { UpdateJoinRequestStatusService } from "@services/join-request/update-join-request-status.service";
import { NoPermissionsError } from "@services/common/errors/no-permissions.error";
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
    private readonly joinRequestService: UpdateJoinRequestStatusService
  ) {}

  @HttpCode(201)
  @Put("/join-requests/:id")
  async sendJoinRequest(
    @CurrentUser({ required: true }) user: User,
    @Param("id") id: number,
    @Body() dto: UpdateJoinRequestDTO
  ): Promise<SendJoinRequestResponse> {
    try {
      const joinRequest = await this.joinRequestService.updateStatus({
        id,
        requestingUserId: user.id,
        newStatus: dto.status,
      });

      return { data: joinRequest };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundError(e.message);
      } else if (e instanceof NoPermissionsError) {
        throw new ForbiddenError(e.message);
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
