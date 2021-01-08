import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { IIdentifiableEntityRepository } from "../identifiable-entity.repository.interface";
import { JoinRequestRelationKeys } from "./join-request-relation-keys";

export interface IJoinRequestRepository
  extends IIdentifiableEntityRepository<JoinRequest> {
  findByKeys(keys: JoinRequestRelationKeys): Promise<JoinRequest[]>;
}
