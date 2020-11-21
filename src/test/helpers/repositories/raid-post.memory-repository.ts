import { RaidPost } from "../../../entities/raid-post.entitity";
import { IRaidPostRepository } from "../../../repositories/raid-post.repository";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RaidPostMemoryRepository
  extends IdentifiableMemoryRepository<RaidPost>
  implements IRaidPostRepository {}
