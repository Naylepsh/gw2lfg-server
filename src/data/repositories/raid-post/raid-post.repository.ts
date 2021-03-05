import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { RaidPost } from "../../entities/raid-post/raid-post.entitity";
import { IdentifiableEntityRepository } from "../generic-identifiable-entity.repository";
import { FindManyParams } from "../find-many.params";
import { IRaidPostRepository } from "./raid-post.repository.interface";

@Service()
@EntityRepository(RaidPost)
export class RaidPostRepository
  extends IdentifiableEntityRepository<RaidPost>
  implements IRaidPostRepository {
  private static relations = ["author", "requirements", "bosses", "roles"];

  findMany(params: FindManyParams<RaidPost>) {
    return super.findMany({
      ...params,
      relations: RaidPostRepository.relations,
    });
  }

  findById(
    id: number,
    relations: string[] = RaidPostRepository.relations
  ): Promise<RaidPost | undefined> {
    return super.findById(id, relations);
  }
}
