import { JoinRequest } from "@root/data/entities/join-request/join-request.entity";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";
import { JoinRequestRelationKeys } from "../../data/repositories/join-request/join-request-relation-keys";

export class JoinRequestMemoryRepository
  extends IdentifiableMemoryRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKeys(keys: JoinRequestRelationKeys): Promise<JoinRequest[]> {
    const { userId, postId, roleId } = keys;

    return this.findMany({
      where: {
        user: { id: userId },
        post: { id: postId },
        role: { id: roleId },
      },
    });
  }
}
