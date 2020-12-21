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
import { User } from "@data/entities/user.entity";
import { PostAuthorshipService } from "@services/raid-post/authorship.service";
import { EntityNotFoundError } from "@services/errors/entity-not-found.error";
import { UpdateRaidPostService } from "@services/raid-post/update.service";
import { SaveRaidPostDTO } from "./save-raid-post.dto";
import {
  mapRaidPostToRaidPostResponse,
  RaidPostResponse,
} from "../../responses/entities/raid-post.entity.response";
import { IRouteResponse } from "../../responses/routes/route.response.interface";

interface UpdateRaidPostResponse extends IRouteResponse<RaidPostResponse> {}

@JsonController()
export class UpdateRaidPostController {
  constructor(
    private readonly updateService: UpdateRaidPostService,
    private readonly authorshipService: PostAuthorshipService
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
      return { data: mapRaidPostToRaidPostResponse(post)}
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
