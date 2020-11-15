import { RaidPost } from "../entities/raid-post.entitity";
import { GenericRepository } from "./generic.repository";
import { FindParams, IRepository } from "./repository.interface";

export interface IRaidPostRepository extends IRepository<RaidPost> {}

export class RaidPostRepository
  extends GenericRepository<RaidPost>
  implements IRaidPostRepository {
  private static relations = ["author", "requirements", "bosses"];

  findMany(params: FindParams<RaidPost>) {
    const _params = { ...params, relations: RaidPostRepository.relations };
    return super.findMany(_params);
  }

  findById(id: number): Promise<RaidPost | undefined> {
    return super.findById(id, RaidPostRepository.relations);
  }
}
