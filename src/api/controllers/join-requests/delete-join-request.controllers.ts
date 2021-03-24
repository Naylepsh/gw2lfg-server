import {
  CurrentUser,
  Delete,
  ForbiddenError,
  HttpCode,
  InternalServerError,
  JsonController,
  NotFoundError,
  OnUndefined,
  Param,
} from "routing-controllers";
import { User } from "@data/entities/user/user.entity";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { CheckJoinRequestDeletionPermissionService } from "@services/join-request/check-join-request-deletion-permission.service";
import { DeleteJoinRequestService } from "@services/join-request/delete-raid-post.service";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for DELETE /join-requests/:id requests.
 * Deletes a post with given id.
 * Join request can be deleted by either its author (cancelling the request)
 * or by the author of the post that join request points to (rejecting the request).
 * User has to be authenticated to use this route.
 */
@JsonController()
export class DeleteJoinRequestController {
  constructor(
    private readonly joinRequestService: DeleteJoinRequestService,
    private readonly joinRequestPermissionService: CheckJoinRequestDeletionPermissionService
  ) {}

  @HttpCode(204)
  @OnUndefined(204)
  @Delete("/join-requests/:id")
  async handleRequest(
    @CurrentUser({ required: true }) user: User,
    @Param("id") id: number
  ) {
    try {
      return await this.deleteJoinRequest(user, id);
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

  private async deleteJoinRequest(user: User, id: number) {
    const canDelete = await this.joinRequestPermissionService.canUserDelete({
      userId: user.id,
      joinRequestId: id,
    });
    if (!canDelete) {
      throw new ForbiddenError();
    }

    return this.joinRequestService.delete({
      id,
    });
  }
}
