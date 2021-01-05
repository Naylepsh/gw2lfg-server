import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { IIdentifiableEntityRepository } from "../repository.interface";

export interface IJoinRequestRepository
  extends IIdentifiableEntityRepository<JoinRequest> {
  findByKey(
    userId: number,
    postId: number,
    roleId: number
  ): Promise<JoinRequest | undefined>;
}
