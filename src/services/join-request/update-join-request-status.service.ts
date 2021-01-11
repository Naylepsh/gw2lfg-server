import { Inject, Service } from "typedi";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { joinRequestRepositoryType } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../common/errors/entity-not-found.error";
import { UpdateJoinRequestStatusDTO } from "./dtos/update-join-request-status.dto";

/*
Service for updating the status of join requests.
*/
@Service()
export class UpdateJoinRequestStatusService {
  constructor(
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  async updateStatus(dto: UpdateJoinRequestStatusDTO) {
    const { id, newStatus } = dto;

    const request = await this.joinRequestRepo.findOne({
      where: { id },
      relations: ["user", "post", "role"],
    });

    if (!request) {
      throw new EntityNotFoundError(
        `Join request with id ${id} could not be found.`
      );
    }

    return this.joinRequestRepo.save({ ...request, status: newStatus });
  }
}
