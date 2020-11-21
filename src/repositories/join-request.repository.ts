import { EntityRepository } from "typeorm";
import { JoinRequest } from "../entities/join-request";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IJoinRequestRepository extends IRepository<JoinRequest> {
  findByKey(userId: number, postId: number): Promise<JoinRequest | undefined>;
}

@EntityRepository(JoinRequest)
export class JoinRequestRepository
  extends GenericRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKey(userId: number, postId: number): Promise<JoinRequest | undefined> {
    return this.findOne({ where: { userId, postId } });
  }
}
