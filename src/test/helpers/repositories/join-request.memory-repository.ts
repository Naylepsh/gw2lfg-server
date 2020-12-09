import { JoinRequest } from "../../../data/entities/join-request.entity";
import { IJoinRequestRepository } from "../../../data/repositories/join-request/join-request.repository.interface";
import { MemoryRepository } from "./memory-repository";

export class JoinRequestMemoryRepository
  extends MemoryRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKey(userId: number, postId: number): Promise<JoinRequest | undefined> {
    return this.findOne({ where: { userId, postId } });
  }
}
