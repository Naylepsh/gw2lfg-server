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
import { User } from "@root/data/entities/user/user.entity";
import { CheckPostAuthorshipService } from "@root/services/raid-post/check-post-authorship.service";
import { EntityNotFoundError } from "@root/services/common/errors/entity-not-found.error";
import { DeleteRaidPostService } from "@root/services/raid-post/delete-raid-post.service";

/**
 * Controller for DELETE /raid-posts/:id requests.
 * Removes the post of given id from the database.
 * User has to be both authenticated and the post's author to use.
 */
@JsonController()
export class DeleteRaidPostController {
  constructor(
    private readonly deleteService: DeleteRaidPostService,
    private readonly authorshipService: CheckPostAuthorshipService
  ) {}

  @HttpCode(204)
  @OnUndefined(204)
  @Delete("/raid-posts/:id")
  async delete(
    @CurrentUser({ required: true }) user: User,
    @Param("id") postId: number
  ) {
    try {
      // Only the author can delete their posts
      const isAuthor = await this.authorshipService.isPostAuthor({
        userId: user.id,
        postId,
      });
      if (!isAuthor) throw new ForbiddenError();

      return await this.deleteService.delete({ id: postId });
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
