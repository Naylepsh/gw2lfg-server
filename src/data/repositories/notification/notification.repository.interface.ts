import { Notification } from "../../entities/notification/notification.entity";

export interface INotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findOne(params: NotificationQueryParams): Promise<Notification | undefined>;
  findMany(params: NotificationsQueryParams): Promise<Notification[]>;
  delete(criteria?: any): Promise<void>;
}

export interface NotificationQueryParams {
  where?: {
    id?: number;
    recipentId?: string;
    seen?: boolean;
  };
}

export interface NotificationsQueryParams extends NotificationQueryParams {
  skip?: number;
  take?: number;
}
