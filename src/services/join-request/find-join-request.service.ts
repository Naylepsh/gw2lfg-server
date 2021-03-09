import { Inject, Service } from "typedi";
import { joinRequestRepositoryType } from "@loaders/typedi.constants";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { FindJoinRequestDTO } from "./dtos/find-join-request.dto";
import { EntityNotFoundError } from "../common/errors/entity-not-found.error";

/**
 * Service for finding join request with matching id.
 */
@Service()
export class FindJoinRequestService {
  constructor(
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  async find(dto: FindJoinRequestDTO) {
    const request = await this.joinRequestRepo.findById(dto.id);

    if (!request) {
      throw new EntityNotFoundError(
        `Join request with ${dto.id} could not be found.`
      );
    }

    return request;
  }
}
