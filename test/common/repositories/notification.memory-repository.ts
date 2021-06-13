import { IdentifiableMemoryRepository } from "./memory-repository";
import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Notification } from "@data/entities/notification/notification.entity";

export class NotificationMemoryRepository
  extends IdentifiableMemoryRepository<Notification>
  implements INotificationRepository {}
