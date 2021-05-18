import {
  BadRequestError,
  Body,
  CurrentUser,
  HttpCode,
  InternalServerError,
  JsonController,
  Post,
} from "routing-controllers";
import { User } from "@root/data/entities/user/user.entity";
import { CreateRaidPostService } from "@root/services/raid-post/create-raid-post.service";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { SaveRaidPostDTO } from "./dtos/save-raid-post.dto";
import { PublishRaidPostResponse } from "./responses/create-raid-post.response";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";
import { InvalidPropertyError } from "../../../services/common/errors/invalid-property.error";

/**
 * Controller for POST /raid-posts requests.
 * Takes post props and saves it in database if those props are valid.
 * Returns created resource.
 * User has to be authenticated to use.
 */
@JsonController()
export class CreateRaidPostController {
  constructor(private readonly createService: CreateRaidPostService) {}

  @HttpCode(201)
  @Post("/raid-posts")
  async handleRequest(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: SaveRaidPostDTO
  ): Promise<PublishRaidPostResponse> {
    try {
      return await this.createPost(dto, user);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async createPost(dto: SaveRaidPostDTO, user: User) {
    const post = await this.createService.create({
      ...dto,
      date: new Date(dto.date),
      authorId: user.id,
    });

    return { data: mapRaidPostToRaidPostResponse(post) };
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof InvalidPropertyError) {
      throw new BadRequestError(message);
    } else {
      throw new InternalServerError(message);
    }
  }
}
