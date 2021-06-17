import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { Notification } from "../../entities/notification/notification.entity";
import {
  INotificationRepository,
  NotificationQueryParams,
  NotificationsQueryParams,
} from "./notification.repository.interface";

@Service()
@EntityRepository(Notification)
export class NotificationRepository
  extends AbstractRepository<Notification>
  implements INotificationRepository
{
  save(notification: Notification): Promise<Notification> {
    return this.repository.save(notification);
  }

  findOne(params: NotificationQueryParams): Promise<Notification | undefined> {
    return this.repository.findOne(params);
  }

  findMany(params: NotificationsQueryParams): Promise<Notification[]> {
    return this.repository.find(params);
  }

  async delete(criteria?: any): Promise<void> {
    await this.repository.delete(criteria);
  }
}
