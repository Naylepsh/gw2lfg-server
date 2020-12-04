import {
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  Post,
} from "routing-controllers";
import { Inject } from "typedi";
import { User } from "../../../data/entities/user.entity";
import { PublishRaidPostService } from "../../../services/raid-post/publish.service";
import { RaidPostDTO } from "./raid-post.dto";

@JsonController()
export class PublishRaidPostController {
  constructor(
    @Inject() private readonly publishService: PublishRaidPostService
  ) {}

  @HttpCode(201)
  @Post("/raid-posts")
  async publish(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: RaidPostDTO
  ) {
    return await this.publishService.publish({ ...dto, authorId: user.id });
  }
}
