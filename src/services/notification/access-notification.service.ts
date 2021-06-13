import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { Inject } from "typedi";
import { types } from "@loaders/typedi.constants";
import { User } from "@data/entities/user/user.entity";
import { byId } from "@data/queries/common.queries";

export class AccessNotificationService {
  constructor(
    @Inject(types.repositories.notification)
    private readonly repository: INotificationRepository
  ) {}

  canAccess(user: User, id: number): Promise<boolean>;
  canAccess(user: User, recipent: string): Promise<boolean>;
  async canAccess(user: User, data: any): Promise<boolean> {
    const recipent =
      typeof data === "string"
        ? data
        : (await this.getNotification(data))?.recipent;
    return user.username === recipent;
  }

  private getNotification(id: number) {
    return this.repository.findOne(byId(id));
  }
}
