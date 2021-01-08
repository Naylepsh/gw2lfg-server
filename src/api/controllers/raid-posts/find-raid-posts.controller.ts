import {
  CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers";
import { Inject } from "typedi";
import { User } from "@root/data/entities/user/user.entity";
import {
  findRaidPostsServiceType,
  requirementsCheckServiceType,
} from "@loaders/typedi.constants";
import { FindRaidPostsService } from "@root/services/raid-post/find-raid-posts.service";
import { ICheckRequirementsService } from "@services/requirement/check-requirements.service.interface";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { FindRaidPostsResponse } from "./responses/find-raid-posts.response";
import { FindRaidPostsQueryParams } from "./params/find-raid-posts.query-params";
import { unsatisfyEachRequirement } from "./utils/unsatisfy-each-requirement";
import { checkIfUserMeetsPostsRequirements } from "./utils/check-if-user-meets-posts-requirements";
import { MoreThan } from "typeorm";

/*
Controller for GET /raid-posts requests.
Returns paginated posts according to query params (skip and take) which are scheduled to happen in the future.
Providing user token will check whether that user meets the posts'requirements to join
but it's not required.
*/
@JsonController()
export class FindRaidPostsController {
  constructor(
    @Inject(findRaidPostsServiceType)
    private readonly findService: FindRaidPostsService,
    @Inject(requirementsCheckServiceType)
    private readonly requirementsCheckService: ICheckRequirementsService
  ) {}

  @Get("/raid-posts")
  async findAll(
    @QueryParams() query: FindRaidPostsQueryParams,
    @CurrentUser() user?: User
  ): Promise<FindRaidPostsResponse> {
    const now = new Date();
    const { posts, hasMore } = await this.findService.find({
      ...query,
      // searching for posts which planned event date is somewhere in the future
      where: { date: MoreThan(now) },
    });

    // if user is not authenticated we say that they fail to meet the requirements
    // otherwise we properly check
    const _posts = user
      ? await checkIfUserMeetsPostsRequirements(
          posts,
          user,
          this.requirementsCheckService
        )
      : unsatisfyEachRequirement(posts);

    return { data: _posts.map(mapRaidPostToRaidPostResponse), hasMore };
  }
}
