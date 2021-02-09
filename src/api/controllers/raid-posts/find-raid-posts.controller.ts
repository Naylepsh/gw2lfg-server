import { Get, JsonController, QueryParams } from "routing-controllers";
import { Inject } from "typedi";
import { findRaidPostsServiceType } from "@loaders/typedi.constants";
import { FindRaidPostsService } from "@root/services/raid-post/find-raid-posts.service";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { FindRaidPostsResponse } from "./responses/find-raid-posts.response";
import { FindRaidPostsQueryParams } from "./params/find-raid-posts.query-params";

/*
Controller for GET /raid-posts requests.
Returns paginated posts according to query params (skip and take) which are scheduled to happen in the future.
*/
@JsonController()
export class FindRaidPostsController {
  constructor(
    @Inject(findRaidPostsServiceType)
    private readonly findService: FindRaidPostsService
  ) {}

  @Get("/raid-posts")
  async findAll(
    @QueryParams() query: FindRaidPostsQueryParams
  ): Promise<FindRaidPostsResponse> {
    const whereParams = this.turnQueryIntoWhereParams(query);

    const { posts, hasMore } = await this.findService.find({
      ...query,
      whereParams,
    });

    return { data: posts.map(mapRaidPostToRaidPostResponse), hasMore };
  }

  private turnQueryIntoWhereParams(query: FindRaidPostsQueryParams) {
    const minDate = query.minDate ?? new Date();
    const server = query.server;
    const bossesIds = query.bossesIds?.split(",").map((id) => parseInt(id));
    const authorId = query.authorId;
    const authorName = query.authorName;
    const role =
      query.roleClass || query.roleName
        ? {
            class: query.roleClass,
            name: query.roleName,
          }
        : undefined;

    const whereParams = {
      minDate,
      server,
      bossesIds,
      authorId,
      authorName,
      role,
    };

    return whereParams;
  }
}
