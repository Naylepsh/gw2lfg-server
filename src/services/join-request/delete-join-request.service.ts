import { Inject, Service } from "typedi";
import { joinRequestRepositoryType } from "@loaders/typedi.constants";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { DeleteJoinRequestDTO } from "./dtos/delete-join-request.dto";

/**
 * Service for deleting join request with matching id.
 */
@Service()
export class DeleteJoinRequestService {
  constructor(
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  async delete(dto: DeleteJoinRequestDTO) {
    await this.joinRequestRepo.delete({ id: dto.id });
  }
}
