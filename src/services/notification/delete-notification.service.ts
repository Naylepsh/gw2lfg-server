import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Inject } from "typedi";
import { types } from "../../loaders/typedi.constants";
import { FindNotificationDTO } from "./dtos/find-notification.dto";

export class DeleteNotificationService {
  constructor(
    @Inject(types.repositories.notification)
    private readonly repository: INotificationRepository
  ) {}

  delete(dto: FindNotificationDTO) {
    return this.repository.delete(dto);
  }
}
