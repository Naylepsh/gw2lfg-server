import { Inject } from "typedi";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { joinRequestRepositoryType } from "@loaders/typedi.constants";
import { CanUserChangeJoinRequestStatusDTO } from "./dtos/can-user-change-join-request-status.dto";

export class CheckJoinRequestStatusChangePermissionService {
  constructor(
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  async canUserChangeJoinRequestStatus(dto: CanUserChangeJoinRequestStatusDTO) {
    const { userId, joinRequestId } = dto;

    const request = await this.joinRequestRepo.findOne({
      where: { id: joinRequestId },
      relations: ["post", "post.author"],
    });

    const isPostAuthor = request?.post.author.id === userId;

    return isPostAuthor;
  }
}
