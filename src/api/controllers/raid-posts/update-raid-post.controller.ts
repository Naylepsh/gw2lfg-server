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

@JsonController()
export class UpdateRaidPostController {
  constructor(
    private readonly updateService: UpdateRaidPostService,
    private readonly authorshipService: CheckPostAuthorshipService
  ) {}

  @Put("/raid-posts/:id")
  async update(
    @CurrentUser({ required: true }) user: User,
    @Param("id") postId: number,
    @Body() dto: SaveRaidPostDTO
  ): Promise<UpdateRaidPostResponse> {
    try {
      const isAuthor = await this.authorshipService.isPostAuthor({
        userId: user.id,
        postId,
      });
      if (!isAuthor) throw new ForbiddenError();

      const post = await this.updateService.update({ ...dto, id: postId });
      return { data: mapRaidPostToRaidPostResponse(post) };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundError();
      } else if (e instanceof ForbiddenError) {
        throw e;
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
