import { IRaidPostRepository } from "../../data/repositories/raid-post/raid-post.repository.interface";
import { EntityNotFoundError } from "./entity-not-found.error";

export interface CheckAuthorshipDTO {
  userId: number;
  postId: number;
}

export class PostAuthorshipService {
  constructor(private readonly postRepository: IRaidPostRepository) {}

  async isPostAuthor(dto: CheckAuthorshipDTO) {
    const post = await this.postRepository.findById(dto.postId);

    if (!post) {
      throw new EntityNotFoundError();
    }

    return post.author.id === dto.userId;
  }
}
