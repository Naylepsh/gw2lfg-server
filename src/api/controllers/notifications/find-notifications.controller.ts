import { Get, JsonController, QueryParams } from "routing-controllers";
import { FindNotificationsService } from "@services/notification/find-notifications.service";
import { FindNotificationsDTO } from "./dtos/find-notifications.dto";
import { parseNotificationDto } from "./utils/parse-notification-dto";

/**
 * Controller for GET /notifications requests.
 * Returns paginated result of matched notifications.
 */
@JsonController()
export class FindNotificationsController {
  constructor(private readonly findService: FindNotificationsService) {}

  // TODO: only allow users to show their own notifications
  @Get("/notifications")
  async find(@QueryParams() dto: FindNotificationsDTO) {
    const notifications = await this.findService.find(
      parseNotificationDto(dto)
    );

    return { data: notifications };
  }
}
