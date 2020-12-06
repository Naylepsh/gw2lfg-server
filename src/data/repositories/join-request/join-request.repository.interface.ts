import { JoinRequest } from "../../entities/join-request.entity";
import { IRepository } from "../repository.interface";

export interface IJoinRequestRepository extends IRepository<JoinRequest> {
  findByKey(userId: number, postId: number): Promise<JoinRequest | undefined>;
}
