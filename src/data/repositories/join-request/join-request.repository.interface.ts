import { JoinRequest } from "../../entities/join-request";
import { IRepository } from "../repository.interface";

export interface IJoinRequestRepository extends IRepository<JoinRequest> {
  findByKey(userId: number, postId: number): Promise<JoinRequest | undefined>;
}
