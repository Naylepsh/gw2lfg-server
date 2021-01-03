import {
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  Post,
} from "routing-controllers";
import { User } from "@data/entities/user.entity";
import { PublishRaidPostService } from "@root/services/raid-post/publish-raid-posts.service";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { SaveRaidPostDTO } from "./dtos/save-raid-post.dto";
import { PublishRaidPostResponse } from "./responses/publish-raid-post.response";

@JsonController()
export class PublishRaidPostController {
  constructor(private readonly publishService: PublishRaidPostService) {}

  @HttpCode(201)
  @Post("/raid-posts")
  async publish(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: SaveRaidPostDTO
  ): Promise<PublishRaidPostResponse> {
    const post = await this.publishService.publish({
      ...dto,
      authorId: user.id,
    });
    return { data: mapRaidPostToRaidPostResponse(post) };
  }
}
