import { RaidPost } from "../entities/raid-post.entitity";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IRaidPostRepository extends IRepository<RaidPost> {}

export class RaidPostRepository
  extends GenericRepository<RaidPost>
  implements IRaidPostRepository {
  findById(id: number): Promise<RaidPost | undefined> {
    const relations = ["author", "requirements", "bosses"];
    return super.findById(id, relations);
  }
}
