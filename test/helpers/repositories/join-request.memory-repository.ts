import { JoinRequest } from "@root/data/entities/join-request/join-request.entity";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";
import { FindKeys } from "../../data/repositories/join-request/find-keys";

export class JoinRequestMemoryRepository
  extends IdentifiableMemoryRepository<JoinRequest>
  implements IJoinRequestRepository {
  findByKeys(keys: FindKeys): Promise<JoinRequest[]> {
    const { userId, postId, roleId } = keys;
    return this.findMany({ where: { userId, postId, roleId } });
  }
}
