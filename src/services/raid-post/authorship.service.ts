import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import { raidPostRepositoryType } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../errors/entity-not-found.error";

export interface CheckAuthorshipDTO {
  userId: number;
  postId: number;
}

@Service()
export class PostAuthorshipService {
  constructor(
    @Inject(raidPostRepositoryType)
    private readonly postRepository: IRaidPostRepository
  ) {}

  async isPostAuthor(dto: CheckAuthorshipDTO) {
    const post = await this.postRepository.findById(dto.postId);

    if (!post) {
      throw new EntityNotFoundError();
    }

    return post.author.id === dto.userId;
  }
}
