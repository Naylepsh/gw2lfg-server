import { JoinRequest } from "../../entities/join-request/join-request.entity";

export interface IJoinRequestRepository {
  save(joinRequest: JoinRequest): Promise<JoinRequest>;
  findOne(params: JoinRequestQueryParams): Promise<JoinRequest | undefined>;
  findMany(params: JoinRequestQueryParams): Promise<JoinRequest[]>;
  delete(criteria?: any): Promise<void>;
}

export interface JoinRequestQueryParams {
  where: {
    id?: number;
    user?: { id: number };
    post?: { id: number };
    role?: { id: number };
  };
  relations?: string[];
}
