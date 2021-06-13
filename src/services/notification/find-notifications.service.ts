import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Inject } from "typedi";
import { types } from "@loaders/typedi.constants";
import { FindNotificationsDTO } from "./dtos/find-notifications.dto";

export class FindNotificationsService {
  constructor(
    @Inject(types.repositories.notification)
    private readonly repository: INotificationRepository
  ) {}

  async find(dto: FindNotificationsDTO) {
    const { skip, take, ...where } = dto;
    const notifications = await this.repository.findMany({
      where,
      skip,
      take: take + 1,
      order: { createdAt: "ASC" },
    });

    return { notifications: notifications.slice(0, take), hasMore: notifications.length === take + 1}
  }
}
