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
import { FindRaidPostService } from "@root/services/raid-post/find-raid-posts.service";
import { ICheckRequirementsService } from "@services/requirement/check-requirements.service.interface";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { RaidPost } from "@data/entities/raid-post.entitity";
import { FindRaidPostsResponse } from "./find-raid-posts.response";
import { FindRaidPostsQueryParams } from "./find-raid-posts.query-params";

@JsonController()
export class FindRaidPostsController {
  constructor(
    @Inject(findRaidPostsServiceType)
    private readonly findService: FindRaidPostService,
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
      ? await this.checkIfUserMeetsPostsRequirements(posts, user)
      : this.unsatisfyEachRequirement(posts);
    return { data: _posts.map(mapRaidPostToRaidPostResponse), hasMore };
  }

  private async checkIfUserMeetsPostsRequirements(
    posts: RaidPost[],
    user: User
  ) {
    const satisfiesRequirements = await Promise.all(
      posts.map((post) =>
        this.requirementsCheckService.areRequirementsSatisfied(
          post.requirements,
          user
        )
      )
    );
    const _posts = posts.map((post, index) => ({
      ...post,
      userMeetsRequirements: satisfiesRequirements[index],
    }));
    return _posts;
  }

  private unsatisfyEachRequirement(posts: RaidPost[]) {
    const _posts = posts.map((post) => ({
      ...post,
      userMeetsRequirements: false,
    }));
    return _posts;
  }
}
