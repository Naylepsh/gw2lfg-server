import { RaidPost } from "../../entities/raid-post.entitity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { FindManyParams } from "../repository.interface";
import { IRaidPostRepository } from "./raid-post.repository.interface";

export class RaidPostRepository
  extends IdentifiableEntityRepository<RaidPost>
  implements IRaidPostRepository {
  private static relations = ["author", "requirements", "bosses"];

  findMany(params: FindManyParams<RaidPost>) {
    const _params = { ...params, relations: RaidPostRepository.relations };
    return super.findMany(_params);
  }

  findById(id: number): Promise<RaidPost | undefined> {
    return super.findById(id, RaidPostRepository.relations);
  }
}
