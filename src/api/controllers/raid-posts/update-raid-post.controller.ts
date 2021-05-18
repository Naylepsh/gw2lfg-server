import {
  Body,
  CurrentUser,
  ForbiddenError,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Put,
} from "routing-controllers";
import { User } from "@root/data/entities/user/user.entity";
import { CheckPostAuthorshipService } from "@root/services/raid-post/check-post-authorship.service";
import { EntityNotFoundError } from "@root/services/common/errors/entity-not-found.error";
import { UpdateRaidPostService } from "@root/services/raid-post/update-raid-post.service";
import { SaveRaidPostDTO } from "./dtos/save-raid-post.dto";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { UpdateRaidPostResponse } from "./responses/update-raid-post.response";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for PUT /raid-posts/:id requests.
 * Takes post props and overrides the post that has the same id.
 * Throws 404 if post was not found.
 * Returns created resource.
 * User has to be both authenticated and the post's author to use.
 */
@JsonController()
export class UpdateRaidPostController {
  constructor(
    private readonly updateService: UpdateRaidPostService,
    private readonly authorshipService: CheckPostAuthorshipService
  ) {}

  @Put("/raid-posts/:id")
  async handleRequest(
    @CurrentUser({ required: true }) user: User,
    @Param("id") postId: number,
    @Body() dto: SaveRaidPostDTO
  ): Promise<UpdateRaidPostResponse> {
    try {
      return await this.updateRaidPost(user, postId, dto);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async updateRaidPost(
    user: User,
    postId: number,
    dto: SaveRaidPostDTO
  ) {
    // Only the author can update their posts
    const isAuthor = await this.authorshipService.isPostAuthor({
      userId: user.id,
      postId,
    });
    if (!isAuthor) throw new ForbiddenError();

    const post = await this.updateService.update({
      ...dto,
      date: new Date(dto.date),
      id: postId,
    });

    return { data: mapRaidPostToRaidPostResponse(post) };
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundError();
    } else if (error instanceof ForbiddenError) {
      throw error;
    } else {
      throw new InternalServerError(message);
    }
  }
}
