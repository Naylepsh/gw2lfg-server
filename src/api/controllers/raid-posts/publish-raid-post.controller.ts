import {
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  Post,
} from "routing-controllers";
import { User } from "@root/data/entities/user/user.entity";
import { PublishRaidPostService } from "@root/services/raid-post/publish-raid-post.service";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { SaveRaidPostDTO } from "./dtos/save-raid-post.dto";
import { PublishRaidPostResponse } from "./responses/publish-raid-post.response";

/**
 * Controller for POST /raid-posts requests.
 * Takes post props and saves it in database if those props are valid.
 * Returns created resource.
 * User has to be authenticated to use.
 */
@JsonController()
export class PublishRaidPostController {
  constructor(private readonly publishService: PublishRaidPostService) {}

  @HttpCode(201)
  @Post("/raid-posts")
  async publish(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: SaveRaidPostDTO
  ): Promise<PublishRaidPostResponse> {
    /**
     * If user passed authentication but somehow publish service could not find such a user
     * then something is unexpectedly wrong, thus implicitly throwing InternalServerError
     */
    const post = await this.publishService.publish({
      ...dto,
      authorId: user.id,
    });

    return { data: mapRaidPostToRaidPostResponse(post) };
  }
}
