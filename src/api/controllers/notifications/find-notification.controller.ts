import {
  CurrentUser,
  ForbiddenError,
  Get,
  JsonController,
  Param,
} from "routing-controllers";
import { User } from "@data/entities/user/user.entity";
import { AccessNotificationService } from "@services/notification/access-notification.service";
import { FindNotificationService } from "@services/notification/find-notification.service";

/**
 * Controller for GET /notifications requests.
 * Returns paginated result of matched notifications.
 */
@JsonController()
export class FindNotificationController {
  constructor(
    private readonly findService: FindNotificationService,
    private readonly accessService: AccessNotificationService
  ) {}

  @Get("/notifications/:id")
  async find(
    @Param("id") id: number,
    @CurrentUser({ required: true }) user: User
  ) {
    const canAccess = await this.accessService.canAccess(user, id);
    if (!canAccess) {
      throw new ForbiddenError();
    }

    const notifications = await this.findService.find({ id });

    return { data: notifications };
  }
}
