import { RaidPost } from "@data/entities/raid-post.entitity";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RaidPostMemoryRepository
  extends IdentifiableMemoryRepository<RaidPost>
  implements IRaidPostRepository {}
