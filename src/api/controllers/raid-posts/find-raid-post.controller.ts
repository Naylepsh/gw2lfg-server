import {
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { Inject } from "typedi";
import { findRaidPostServiceType } from "@loaders/typedi.constants";
import { FindRaidPostService } from "@services/raid-post/find-raid-post.service";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { FindRaidPostResponse } from "./responses/find-raid-post.response";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for GET /raid-posts/:id requests.
 * Returns a post with matching id or throws 404 if post could not be found.
 */
@JsonController()
export class FindRaidPostController {
  constructor(
    @Inject(findRaidPostServiceType)
    private readonly findService: FindRaidPostService
  ) {}

  @Get("/raid-posts/:id")
  async handleRequest(@Param("id") id: number): Promise<FindRaidPostResponse> {
    try {
      return await this.findRaidPost(id);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async findRaidPost(id: number) {
    const post = await this.findService.find({ id });
    return {
      data: mapRaidPostToRaidPostResponse(post),
    };
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundError();
    } else {
      throw new InternalServerError(message);
    }
  }
}
