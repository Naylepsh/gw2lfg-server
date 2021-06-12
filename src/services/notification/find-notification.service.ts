import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Inject } from "typedi";
import { types } from "../../loaders/typedi.constants";
import { FindNotificationDTO } from "./dtos/find-notification.dto";

export class FindNotificationService {
  constructor(
    @Inject(types.repositories.notification)
    private readonly repository: INotificationRepository
  ) {}

  find(dto: FindNotificationDTO) {
    return this.repository.findOne({ where: { ...dto } });
  }
}
