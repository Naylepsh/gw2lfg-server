import { Inject, Service } from "typedi";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { joinRequestRepositoryType } from "@loaders/typedi.constants";
import { CanUserDeleteJoinRequestDTO } from "./dtos/can-user-delete-join-request.dto";

/**
 * Service for checking whether a user of given id can delete a join request of given id.
 * Join request can be deleted by either it's author (cancelling the request)
 * or by the author of the post that join request points to (rejecting the request).
*/
@Service()
export class CheckJoinRequestDeletionPermissionService {
  constructor(
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  async canUserDelete(dto: CanUserDeleteJoinRequestDTO) {
    const { userId, joinRequestId } = dto;

    const request = await this.joinRequestRepo.findOne({
      where: { id: joinRequestId },
      relations: ["user", "post", "post.author"],
    });

    const isPostAuthor = request?.post.author.id === userId;
    const isJoinRequestAuthor = request?.user.id === userId;

    return isPostAuthor || isJoinRequestAuthor;
  }
}
