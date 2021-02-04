import {
  CurrentUser,
  Get,
  JsonController,
  Param,
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
import { FindRaidPostsResponse } from "../raid-posts/responses/find-raid-posts.response";
import { FindRaidPostsQueryParams } from "../raid-posts/params/find-raid-posts.query-params";
import { unsatisfyEachRequirement } from "../raid-posts/utils/unsatisfy-each-requirement";
import { checkIfUserMeetsPostsRequirements } from "../raid-posts/utils/check-if-user-meets-posts-requirements";

/*
Controller for GET /users/:id/raid-posts requests.
Returns paginated posts of given user according to query params (skip and take) which are scheduled to happen in the future.
Providing user token will check whether that user meets the posts'requirements to join but it's not required.
*/
@JsonController()
export class FindUserRaidPostsController {
  constructor(
    @Inject(findRaidPostsServiceType)
    private readonly findService: FindRaidPostsService,
    @Inject(requirementsCheckServiceType)
    private readonly requirementsCheckService: ICheckRequirementsService
  ) {}

  @Get("/users/:id/raid-posts")
  async findAll(
    @QueryParams() query: FindRaidPostsQueryParams,
    @Param("id") userId: number,
    @CurrentUser() user?: User
  ): Promise<FindRaidPostsResponse> {
    const now = new Date();
    const { posts, hasMore } = await this.findService.find({
      ...query,
      // searching for raid posts of given author scheduled to happen in the future
      whereParams: { minDate: now, authorId: userId },
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
