import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { JoinRequestRelationKeys } from "./join-request-relation-keys";

export interface IJoinRequestRepository {
  save(joinRequest: JoinRequest): Promise<JoinRequest>;
  findOne(params: JoinRequestQueryParams): Promise<JoinRequest | undefined>;
  delete(criteria?: any): Promise<void>;
  findByKeys(keys: JoinRequestRelationKeys): Promise<JoinRequest[]>;
}

export interface JoinRequestQueryParams {
  where: {
    id?: number;
    userId?: number;
    postId?: number;
    roleId?: number;
  },
  relations?: string[]
}
