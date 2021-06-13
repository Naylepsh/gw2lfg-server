import {
  BadRequestError,
  Body,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Patch,
} from "routing-controllers";
import { UpdateNotificationService } from "@services/notification/update-notification.service";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";
import { NotificationNotFoundError } from "@services/common/errors/entity-not-found.error";
import { CannotUnseeNotificationError } from "@services/notification/errors/cannot-unsee.error";
import { parseNotificationDto } from "./utils/parse-notification-dto";
import { UpdateNotificationDTO } from "./dtos/update-notification.dto";

/**
 * Controller for PATCH /notifications/:id requests.
 * Returns updated notification.
 */
@JsonController()
export class UpdateNotificationController {
  constructor(private readonly service: UpdateNotificationService) {}

  // TODO: only allow users to update their own notifications
  @Patch("/notifications/:id")
  async handleRequest(
    @Param("id") id: number,
    @Body() dto: UpdateNotificationDTO
  ) {
    try {
      return this.update(dto, id);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async update(dto: UpdateNotificationDTO, id: number) {
    const notifications = await this.service.update({
      ...parseNotificationDto(dto),
      id,
    });

    return { data: notifications };
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof CannotUnseeNotificationError) {
      throw new BadRequestError(message);
    } else if (error instanceof NotificationNotFoundError) {
      throw new NotFoundError(message);
    } else {
      throw new InternalServerError(message);
    }
  }
}
