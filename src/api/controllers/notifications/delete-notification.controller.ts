import {
  CurrentUser,
  Delete,
  ForbiddenError,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
} from "routing-controllers";
import { User } from "@data/entities/user/user.entity";
import { AccessNotificationService } from "@services/notification/access-notification.service";
import { DeleteNotificationService } from "../../../services/notification/delete-notification.service";

/**
 * Controller for DELETE /notifications/:id requests.
 */
@JsonController()
export class DeleteNotificationController {
  constructor(
    private readonly deleteService: DeleteNotificationService,
    private readonly accessService: AccessNotificationService
  ) {}

  @HttpCode(204)
  @OnUndefined(204)
  @Delete("/notifications/:id")
  async find(
    @Param("id") id: number,
    @CurrentUser({ required: true }) user: User
  ) {
    const canAccess = await this.accessService.canAccess(user, id);
    if (!canAccess) {
      throw new ForbiddenError();
    }

    await this.deleteService.delete({ id });
  }
}
