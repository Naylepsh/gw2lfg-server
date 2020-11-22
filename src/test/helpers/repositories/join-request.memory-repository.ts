import { JoinRequest } from "../../../entities/join-request";
import { IJoinRequestRepository } from "../../../repositories/join-request.repository";
import { MemoryRepository } from "./memory-repository";

export class JoinRequestMemoryRepository
  extends MemoryRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKey(userId: number, postId: number): Promise<JoinRequest | undefined> {
    return this.findOne({ where: { userId, postId } });
  }
}
