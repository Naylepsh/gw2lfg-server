import {
  CurrentUser,
  Delete,
  ForbiddenError,
  HttpCode,
  InternalServerError,
  JsonController,
  OnUndefined,
  Param,
} from "routing-controllers";
import { User } from "@data/entities/user.entity";
import { PostAuthorshipService } from "@services/raid-post/authorship.service";
import { EntityNotFoundError } from "@services/errors/entity-not-found.error";
import { UnpublishRaidPostService } from "@services/raid-post/unpublish.service";

@JsonController()
export class UnpublishRaidPostController {
  constructor(
    private readonly unpublishService: UnpublishRaidPostService,
    private readonly authorshipService: PostAuthorshipService
  ) {}

  @HttpCode(204)
  @OnUndefined(204)
  @Delete("/raid-posts/:id")
  async unpublish(
    @CurrentUser({ required: true }) user: User,
    @Param("id") postId: number
  ) {
    try {
      const isAuthor = await this.authorshipService.isPostAuthor({
        userId: user.id,
        postId,
      });
      if (!isAuthor) throw new ForbiddenError();

      return await this.unpublishService.unpublish({ id: postId });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        // Doesn't matter
      } else if (e instanceof ForbiddenError) {
        throw e;
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
