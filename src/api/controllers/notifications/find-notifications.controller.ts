import {
  CurrentUser,
  ForbiddenError,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers";
import { FindNotificationsService } from "@services/notification/find-notifications.service";
import { FindNotificationsDTO } from "./dtos/find-notifications.dto";
import { parseDto } from "./utils/parse-dto";
import { User } from "@data/entities/user/user.entity";
import { AccessNotificationService } from "@services/notification/access-notification.service";

/**
 * Controller for GET /notifications requests.
 * Returns paginated result of matched notifications.
 */
@JsonController()
export class FindNotificationsController {
  constructor(
    private readonly findService: FindNotificationsService,
    private readonly accessService: AccessNotificationService
  ) {}

  @Get("/notifications")
  async find(
    @CurrentUser({ required: true }) user: User,
    @QueryParams() dto: FindNotificationsDTO
  ) {
    const canAccess = dto.recipent
      ? await this.accessService.canAccess(user, dto.recipent)
      : true;
    if (!canAccess) {
      throw new ForbiddenError();
    }

    const notifications = await this.findService.find(
      parseDto({ ...dto, recipent: user.username })
    );

    return { data: notifications };
  }
}
