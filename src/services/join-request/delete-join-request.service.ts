import { Inject, Service } from "typedi";
import { types } from "@loaders/typedi.constants";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { DeleteJoinRequestDTO } from "./dtos/delete-join-request.dto";
import { byId } from "@root/data/queries/common.queries";
import { CreateNotificationService } from "../notification/create-notification.service";
import {
  UserCanceledRequestNotification,
  UserDeclinedYourRequestNotification,
  UserKickedYouFromEventNotification,
  UserLeftYourEventNotification,
  YouCanceledRequestNotification,
  YouDeclinedRequestNotification,
  YouKickedUserNotification,
  YouLeftTheEventNotification,
} from "./notifications/join-request.notifications";
import { Notification } from "@data/entities/notification/notification.entity";

/**
 * Service for deleting join request with matching id.
 */
@Service()
export class DeleteJoinRequestService {
  constructor(
    @Inject(types.repositories.joinRequest)
    private readonly joinRequestRepo: IJoinRequestRepository,
    private readonly notificationService: CreateNotificationService
  ) {}

  async delete(dto: DeleteJoinRequestDTO) {
    const notifications = await this.getNotifications(dto);

    await this.joinRequestRepo.delete(byId(dto.id));

    if (notifications) {
      // TODO: add save([]) to notificationService
      await Promise.all(
        notifications.map((notification) =>
          this.notificationService.save(notification)
        )
      );
    }
  }

  private async getNotifications({
    deletionAuthorId,
    id,
  }: DeleteJoinRequestDTO) {
    if (typeof deletionAuthorId === "undefined") {
      return;
    }

    const query = { ...byId(id), relations: ["user", "post", "post.author"] };
    const joinRequest = await this.joinRequestRepo.findOne(query);

    if (!joinRequest) {
      return;
    }

    const notifications: Notification[] = [];
    const postAuthor = joinRequest.post.author;
    if (
      deletionAuthorId === postAuthor.id &&
      joinRequest.status === "PENDING"
    ) {
      notifications.push(
        new UserCanceledRequestNotification(joinRequest),
        new YouCanceledRequestNotification(joinRequest)
      );
    } else if (
      deletionAuthorId === postAuthor.id &&
      joinRequest.status === "ACCEPTED"
    ) {
      notifications.push(
        new UserLeftYourEventNotification(joinRequest),
        new YouLeftTheEventNotification(joinRequest)
      );
    } else if (joinRequest.status === "PENDING") {
      notifications.push(
        new UserDeclinedYourRequestNotification(joinRequest),
        new YouDeclinedRequestNotification(joinRequest)
      );
    } else if (joinRequest.status === "ACCEPTED") {
      notifications.push(
        new YouKickedUserNotification(joinRequest),
        new UserKickedYouFromEventNotification(joinRequest)
      );
    } else {
      throw new Error("Unhandled join request status case");
    }

    return notifications;
  }
}
