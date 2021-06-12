import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Inject } from "typedi";
import { types } from "../../loaders/typedi.constants";
import { FindNotificationsDTO } from "./dtos/find-notifications.dto";

export class FindNotificationsService {
  constructor(
    @Inject(types.repositories.notification)
    private readonly repository: INotificationRepository) {}

  find(dto: FindNotificationsDTO) {
    return this.repository.findMany({ where: { ...dto } });
  }
}
