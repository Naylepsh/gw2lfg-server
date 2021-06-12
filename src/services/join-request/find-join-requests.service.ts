import { Inject, Service } from "typedi";
import { types } from "@loaders/typedi.constants";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import {
  byJoinRequestRelations,
  JoinRequestRelationParams,
} from "@root/data/queries/join-request.queries";

/**
 * Service for finding join requests by relations keys from the database
 */
@Service()
export class FindJoinRequestsService {
  constructor(
    @Inject(types.repositories.joinRequest)
    private readonly joinRequestRepo: IJoinRequestRepository
  ) {}

  find(keys: JoinRequestRelationParams) {
    return this.joinRequestRepo.findMany(byJoinRequestRelations(keys));
  }
}
