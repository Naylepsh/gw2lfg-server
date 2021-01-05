import { Inject, Service } from "typedi";
import { joinRequestRepositoryType } from "@loaders/typedi.constants";
import { JoinRequestRelationKeys } from "@data/repositories/join-request/join-request-relation-keys";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";

@Service()
export class FindJoinRequestsService {
  constructor(
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  find(keys: JoinRequestRelationKeys) {
    return this.joinRequestRepo.findByKeys(keys);
  }
}
