import {
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  Post,
} from "routing-controllers";
import { User } from "@data/entities/user.entity";
import { PublishRaidPostService } from "@services/raid-post/publish.service";
import {
  mapRaidPostToRaidPostResponse,
  RaidPostResponse,
} from "../../responses/raid-post.response";
import { SaveRaidPostDTO } from "./save-raid-post.dto";

@JsonController()
export class PublishRaidPostController {
  constructor(private readonly publishService: PublishRaidPostService) {}

  @HttpCode(201)
  @Post("/raid-posts")
  async publish(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: SaveRaidPostDTO
  ): Promise<RaidPostResponse> {
    const post = await this.publishService.publish({
      ...dto,
      authorId: user.id,
    });
    return mapRaidPostToRaidPostResponse(post);
  }
}
