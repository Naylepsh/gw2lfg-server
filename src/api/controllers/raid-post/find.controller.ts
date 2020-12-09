import { IsOptional, IsPositive, Min } from "class-validator";
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers";
import { Inject } from "typedi";
import { User } from "../../../data/entities/user.entity";
import {
  findRaidPostsServiceType,
  requirementsCheckServiceType,
} from "../../../loaders/typedi.constants";
import { FindRaidPostService } from "../../../services/raid-post/find.service";
import { ICheckRequirementsService } from "../../../services/requirement/check-requirements.service.interface";
import {
  mapRaidPostToRaidPostResponse,
  RaidPostResponse,
} from "../../responses/raid-post.response";
import { RaidPost } from "../../../data/entities/raid-post.entitity";

type FindSingleRaidPostDTO = RaidPostResponse & {
  userMeetsRequirements: boolean;
};
type FindRaidPostsDTO = FindSingleRaidPostDTO[];

class FindRaidPostsQueryParams {
  @IsOptional()
  @IsPositive()
  take?: number;

  @IsOptional()
  @Min(0)
  skip?: number;
}

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
  ): Promise<FindRaidPostsDTO> {
    const posts = await this.findService.find(query);
    const _posts = user
      ? await this.checkIfUserMeetsPostsRequirements(posts, user)
      : this.unsatisfyEachRequirement(posts);
    const response = _posts.map(mapRaidPostToRaidPostResponse);
    return response;
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