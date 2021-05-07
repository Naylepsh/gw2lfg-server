import { Inject, Service } from "typedi";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { joinRequestRepositoryType } from "@loaders/typedi.constants";
import { CanUserChangeJoinRequestStatusDTO } from "./dtos/can-user-change-join-request-status.dto";
import { byId } from "@data/queries/common/by-id.query";

/**
 * Service for checking whether a user of given id can change the status of a post of given id.
 * Status can be changed only by the post's author that the request points to.
 */
@Service()
export class CheckJoinRequestStatusChangePermissionService {
  constructor(
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  async canUserChangeStatus(dto: CanUserChangeJoinRequestStatusDTO) {
    const { userId, joinRequestId } = dto;

    const request = await this.joinRequestRepo.findOne({
      ...byId(joinRequestId),
      relations: ["post", "post.author"],
    });

    const isPostAuthor = request?.post.author.id === userId;

    return isPostAuthor;
  }
}
