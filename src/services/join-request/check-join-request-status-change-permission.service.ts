import { Inject, Service } from "typedi";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { types } from "@loaders/typedi.constants";
import { CanUserChangeJoinRequestStatusDTO } from "./dtos/can-user-change-join-request-status.dto";
import { byId } from "@root/data/queries/common.queries";

/**
 * Service for checking whether a user of given id can change the status of a post of given id.
 * Status can be changed only by the post's author that the request points to.
 */
@Service()
export class CheckJoinRequestStatusChangePermissionService {
  constructor(
    @Inject(types.repositories.joinRequest)
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
