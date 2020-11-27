import { JoinRequest } from "../../../core/entities/join-request";
import { IJoinRequestRepository } from "../../../core/repositories/join-request.repository.interface";
import { MemoryRepository } from "./memory-repository";

export class JoinRequestMemoryRepository
  extends MemoryRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKey(userId: number, postId: number): Promise<JoinRequest | undefined> {
    return this.findOne({ where: { userId, postId } });
  }
}
