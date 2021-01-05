import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { IIdentifiableEntityRepository } from "../repository.interface";
import { FindKeys } from "./find-keys";

export interface IJoinRequestRepository
  extends IIdentifiableEntityRepository<JoinRequest> {
  findByKeys(keys: FindKeys): Promise<JoinRequest | undefined>;
}
