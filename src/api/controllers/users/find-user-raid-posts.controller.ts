import { Get, JsonController, Param, QueryParams } from "routing-controllers";
import { Inject } from "typedi";
import { findRaidPostsServiceType } from "@loaders/typedi.constants";
import { FindRaidPostsService } from "@root/services/raid-post/find-raid-posts.service";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { FindRaidPostsResponse } from "../raid-posts/responses/find-raid-posts.response";
import { FindRaidPostsDTO } from "../raid-posts/dtos/find-raid-posts.dto";

/**
 * Controller for GET /users/:id/raid-posts requests.
 * Returns paginated posts of given user according to query params (skip and take) which are scheduled to happen in the future.
 */
@JsonController()
export class FindUserRaidPostsController {
  constructor(
    @Inject(findRaidPostsServiceType)
    private readonly findService: FindRaidPostsService
  ) {}

  @Get("/users/:id/raid-posts")
  async handleRequest(
    @QueryParams() query: FindRaidPostsDTO,
    @Param("id") userId: number
  ): Promise<FindRaidPostsResponse> {
    const now = new Date().toISOString();
    const { posts, hasMore } = await this.findService.find({
      ...query,
      // searching for raid posts of given author scheduled to happen in the future
      whereParams: { minDate: now, author: { id: userId } },
    });

    return { data: posts.map(mapRaidPostToRaidPostResponse), hasMore };
  }
}
