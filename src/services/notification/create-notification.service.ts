import { Notification } from "@root/data/entities/notification/notification.entity";
import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Inject } from "typedi";
import { types } from "../../loaders/typedi.constants";
import { CreateNotificationDTO } from "./dtos/create-notification.dto";

export class CreateNotificationService {
  constructor(
    @Inject(types.repositories.notification)
    private readonly repository: INotificationRepository
  ) {}

  save(dto: CreateNotificationDTO): Promise<Notification> {
    return this.repository.save(new Notification(dto));
  }
}
