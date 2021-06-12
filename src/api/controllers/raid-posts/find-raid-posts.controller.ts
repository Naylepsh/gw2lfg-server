import { Get, JsonController, QueryParams } from "routing-controllers";
import { Inject } from "typedi";
import { types } from "@loaders/typedi.constants";
import { FindRaidPostsService } from "@services/raid-post/find-raid-posts.service";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { FindRaidPostsResponse } from "./responses/find-raid-posts.response";
import { FindRaidPostsDTO } from "./dtos/find-raid-posts.dto";
import { FindRaidPostsWhereParams } from "@services/raid-post/dtos/find-raid-posts.dto";

/**
 * Controller for GET /raid-posts requests.
 * Returns paginated posts according to query params (skip and take) which are scheduled to happen in the future.
 */
@JsonController()
export class FindRaidPostsController {
  constructor(
    @Inject(types.services.findRaidPosts)
    private readonly findService: FindRaidPostsService
  ) {}

  @Get("/raid-posts")
  async handleRequest(
    @QueryParams() query: FindRaidPostsDTO
  ): Promise<FindRaidPostsResponse> {
    const whereParams = this.turnQueryIntoWhereParams(query);

    const { posts, hasMore } = await this.findService.find({
      ...query,
      whereParams,
    });

    return { data: posts.map(mapRaidPostToRaidPostResponse), hasMore };
  }

  private turnQueryIntoWhereParams(query: FindRaidPostsDTO) {
    const server = query.server;
    const minDate = query.minDate ?? new Date().toISOString();
    const bossesIds = query.bossesIds?.split(",").map((id) => parseInt(id));
    const author = { id: query.authorId, name: query.authorName };
    const role = {
      class: query.roleClass,
      name: query.roleName,
    };
    const joinRequest = {
      status: query.joinRequestStatus,
      authorId: query.joinRequestAuthorId,
    };

    const whereParams: FindRaidPostsWhereParams = {
      minDate,
      server,
      bossesIds,
      author,
      role,
      joinRequest,
    };

    return whereParams;
  }
}
