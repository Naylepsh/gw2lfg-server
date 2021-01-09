import { Inject, Service } from "typedi";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { JoinRequestStatus } from "@data/entities/join-request/join-request.status";
import { joinRequestRepositoryType } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../common/errors/entity-not-found.error";
import { NoPermissionsError } from "../common/errors/no-permissions.error";

interface UpdateJoinRequestStatusDTO {
  id: number;
  requestingUserId: number;
  newStatus: JoinRequestStatus;
}

/*
Service for updating the status of join requests.
Status can be changed only by the post's author that the request points to.
*/
@Service()
export class UpdateJoinRequestStatusService {
  constructor(
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  async updateStatus(dto: UpdateJoinRequestStatusDTO) {
    const { id, requestingUserId, newStatus } = dto;

    const request = await this.joinRequestRepo.findOne({
      where: { id },
      relations: ["post", "post.author"],
    });

    if (!request) {
      throw new EntityNotFoundError(
        `Join request with id ${id} could not be found.`
      );
    }

    const isPostAuthor = request.post.author.id === requestingUserId;

    if (!isPostAuthor) {
      throw new NoPermissionsError();
    }

    return this.joinRequestRepo.save({ ...request, status: newStatus });
  }
}
