import { Inject, Service } from "typedi";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { types } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../common/errors/entity-not-found.error";
import { UpdateJoinRequestStatusDTO } from "./dtos/update-join-request-status.dto";
import { byId } from "@data/queries/common.queries";
import { RevertStatusToPendingError } from "./errors/revert-to-pending.error";
import {
  UserAcceptedRequestNotification,
  YouAcceptedRequestNotification,
} from "@data/entities/notification/notification.entity";
import { CreateNotificationService } from "../notification/create-notification.service";

/**
 * Service for updating the status of join requests.
 */
@Service()
export class UpdateJoinRequestStatusService {
  constructor(
    @Inject(types.repositories.joinRequest)
    private readonly joinRequestRepo: IJoinRequestRepository,
    private readonly notificationService: CreateNotificationService
  ) {}

  async updateStatus(dto: UpdateJoinRequestStatusDTO) {
    const { id, newStatus } = dto;

    const request = await this.joinRequestRepo.findOne({
      ...byId(id),
      relations: ["user", "post", "role", "post.author"],
    });

    if (!request) {
      throw new EntityNotFoundError(
        `Join request with id ${id} could not be found.`
      );
    }

    if (newStatus === "PENDING" && request.status === "ACCEPTED") {
      throw new RevertStatusToPendingError();
    }

    const notifications = [
      new UserAcceptedRequestNotification(request),
      new YouAcceptedRequestNotification(request),
    ];

    const savedRequest = await this.joinRequestRepo.save({
      ...request,
      status: newStatus,
    });

    await Promise.all(
      notifications.map((notification) =>
        this.notificationService.save(notification)
      )
    );

    return savedRequest;
  }
}
