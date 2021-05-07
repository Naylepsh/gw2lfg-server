import { JoinRequest } from "@root/data/entities/join-request/join-request.entity";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class JoinRequestMemoryRepository
  extends IdentifiableMemoryRepository<JoinRequest>
  implements IJoinRequestRepository {}
