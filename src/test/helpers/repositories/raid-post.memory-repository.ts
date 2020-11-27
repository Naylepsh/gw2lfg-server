import { RaidPost } from "../../../core/entities/raid-post.entitity";
import { IRaidPostRepository } from "../../../core/repositories/raid-post.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RaidPostMemoryRepository
  extends IdentifiableMemoryRepository<RaidPost>
  implements IRaidPostRepository {}
