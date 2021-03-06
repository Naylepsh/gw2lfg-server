import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import { types } from "@loaders/typedi.constants";
import { PostNotFoundError } from "../common/errors/entity-not-found.error";
import { FindRaidPostDTO } from "./dtos/find-raid-post.dto";
import { byId } from "@root/data/queries/common.queries";

/**
 * Service for finding a raid post with matching id.
 * Throws an error if the post could not be found.
 */
@Service(types.services.findRaidPost)
export class FindRaidPostService {
  constructor(
    @Inject(types.repositories.raidPost)
    private readonly repository: IRaidPostRepository
  ) {}

  async find(dto: FindRaidPostDTO) {
    const post = await this.repository.findOne(byId(dto.id));
    if (!post) {
      throw new PostNotFoundError();
    }

    return post;
  }
}
