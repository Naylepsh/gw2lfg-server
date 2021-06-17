import { Notification } from "@root/data/entities/notification/notification.entity";
import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Inject } from "typedi";
import { types } from "@loaders/typedi.constants";
import { NotificationNotFoundError } from "../common/errors/entity-not-found.error";
import { UpdateNotificationDTO } from "./dtos/update-notification.dto";
import { CannotUnseeNotificationError } from "./errors/cannot-unsee.error";

export class UpdateNotificationService {
  constructor(
    @Inject(types.repositories.notification)
    private readonly repository: INotificationRepository
  ) {}

  async update(dto: UpdateNotificationDTO) {
    const notification = await this.repository.findOne({
      where: { id: dto.id },
    });
    if (!notification) {
      throw new NotificationNotFoundError();
    }
    if (notification.seen && dto.seen === false) {
      throw new CannotUnseeNotificationError();
    }

    return this.repository.save(new Notification({ ...notification, ...dto }));
  }
}
