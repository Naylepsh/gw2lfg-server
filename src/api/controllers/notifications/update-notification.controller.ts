import {
  BadRequestError,
  Body,
  CurrentUser,
  ForbiddenError,
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
import { parseDto } from "./utils/parse-dto";
import { UpdateNotificationDTO } from "./dtos/update-notification.dto";
import { User } from "@data/entities/user/user.entity";
import { AccessNotificationService } from "@services/notification/access-notification.service";

/**
 * Controller for PATCH /notifications/:id requests.
 * Returns updated notification.
 */
@JsonController()
export class UpdateNotificationController {
  constructor(
    private readonly notificationService: UpdateNotificationService,
    private readonly accessService: AccessNotificationService
  ) {}

  @Patch("/notifications/:id")
  async handleRequest(
    @Param("id") id: number,
    @CurrentUser({ required: true }) user: User,
    @Body() dto: UpdateNotificationDTO
  ) {
    const canAccess = await this.accessService.canAccess(user, id);
    if (!canAccess) {
      throw new ForbiddenError();
    }

    try {
      return this.update(dto, id);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async update(dto: UpdateNotificationDTO, id: number) {
    const notifications = await this.notificationService.update({
      ...parseDto(dto),
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
