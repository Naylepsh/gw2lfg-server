import { RaidPost } from "../../../entities/raid-post.entitity";
import { IRaidPostRepository } from "../../../repositories/raid-post.repository";
import { MemoryRepository } from "./memory-repository";

export class RaidPostMemoryRepository
  extends MemoryRepository<RaidPost>
  implements IRaidPostRepository {}
