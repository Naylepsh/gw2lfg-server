import { FindOperator } from "typeorm";
import { JoinRequest } from "../../entities/join-request/join-request.entity";

export interface IJoinRequestRepository {
  save(joinRequest: JoinRequest): Promise<JoinRequest>;
  findOne(params: JoinRequestQueryParams): Promise<JoinRequest | undefined>;
  findMany(params: JoinRequestQueryParams): Promise<JoinRequest[]>;
  delete(params: JoinRequestQueryParams): Promise<void>;
}

export interface JoinRequestQueryParams {
  where?: {
    id?: number | FindOperator<number>;
    user?: { id: number | FindOperator<number> };
    post?: { id: number | FindOperator<number> };
    role?: { id: number | FindOperator<number> };
  };
  relations?: string[];
}
