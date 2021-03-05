import {
  CurrentUser,
  Delete,
  ForbiddenError,
  HttpCode,
  JsonController,
  NotFoundError,
  OnUndefined,
  Param,
} from "routing-controllers";
import { User } from "@data/entities/user/user.entity";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { CheckJoinRequestDeletionPermissionService } from "@services/join-request/check-join-request-deletion-permission.service";
import { DeleteJoinRequestService } from "@services/join-request/delete-raid-post.service";

/**
 * Controller for DELETE /join-requests/:id requests.
 * Deletes a post with given id.
 * Join request can be deleted by either it's author (cancelling the request)
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
  async sendJoinRequest(
    @CurrentUser({ required: true }) user: User,
    @Param("id") id: number
  ) {
    try {
      const canDelete = await this.joinRequestPermissionService.canUserDelete({
        userId: user.id,
        joinRequestId: id,
      });
      if (!canDelete) {
        throw new ForbiddenError();
      }

      return await this.joinRequestService.delete({
        id,
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundError(e.message);
      } else {
        throw e;
      }
    }
  }
}
