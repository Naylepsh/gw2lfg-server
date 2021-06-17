import { DeleteNotificationController } from "./delete-notification.controller";
import { FindNotificationController } from "./find-notification.controller";
import { FindNotificationsController } from "./find-notifications.controller";
import { UpdateNotificationController } from "./update-notification.controller";

export const notificationsControllers = [
  FindNotificationsController,
  FindNotificationController,
  UpdateNotificationController,
  DeleteNotificationController,
];
