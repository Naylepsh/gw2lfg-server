import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import { raidPostRepositoryType } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../common/errors/entity-not-found.error";
import { CheckPostAuthorshipDTO } from "./dtos/check-post-authorship.dto";
import { byId } from "@root/data/queries/common.queries";

/**
 * Service for checking authorship of a post.
 * Throws an error if the post could not be found.
 */
@Service()
export class CheckPostAuthorshipService {
  constructor(
    @Inject(raidPostRepositoryType)
    private readonly postRepository: IRaidPostRepository
  ) {}

  async isPostAuthor(dto: CheckPostAuthorshipDTO) {
    const post = await this.postRepository.findOne(byId(dto.postId));

    if (!post) {
      throw new EntityNotFoundError();
    }

    return post.author.id === dto.userId;
  }
}
