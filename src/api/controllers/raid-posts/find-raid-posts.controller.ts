import {
  CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers";
import { Inject } from "typedi";
import { User } from "@data/entities/user.entity";
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
    const { posts, hasMore } = await this.findService.find(query);
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