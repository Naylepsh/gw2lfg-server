import { Notification } from "@data/entities/notification/notification.entity";
import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Inject } from "typedi";
import { types } from "../../loaders/typedi.constants";
import { CreateNotificationDTO } from "./dtos/create-notification.dto";

export class SaveNotificationService {
  constructor(
    @Inject(types.repositories.notification)
    private readonly repository: INotificationRepository
  ) {}

  save(dto: CreateNotificationDTO) {
    return this.repository.save(new Notification(dto));
  }
}
