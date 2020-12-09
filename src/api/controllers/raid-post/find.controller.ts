import { IsOptional, IsPositive, Min } from "class-validator";
import {
  CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers";
import { Inject } from "typedi";
import { RaidPost } from "../../../data/entities/raid-post.entitity";
import { User } from "../../../data/entities/user.entity";
import {
  findRaidPostsServiceType,
  requirementsCheckServiceType,
} from "../../../loaders/typedi.constants";
import { FindRaidPostService } from "../../../services/raid-post/find.service";
import { ICheckRequirementsService } from "../../../services/requirement/check-requirements.service.interface";

type UserResponse = Omit<User, "password" | "apiKey">;
type RaidPostResponse = Omit<
  RaidPost,
  "author" | "hasRequirements" | "hasRoles"
> & { author: UserResponse };

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
    const postsResponses = posts.map(mapRaidPostToRaidPostResponse);
    const _posts = user
      ? await this.checkIfUserMeetsPostsRequirements(postsResponses, user)
      : this.unsatisfyEachRequirement(postsResponses);
    return _posts;
  }

  private async checkIfUserMeetsPostsRequirements(
    posts: RaidPostResponse[],
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
    const _posts: FindRaidPostsDTO = posts.map((post, index) => ({
      ...post,
      userMeetsRequirements: satisfiesRequirements[index],
    }));
    return _posts;
  }

  private unsatisfyEachRequirement(posts: RaidPostResponse[]) {
    const _posts: FindRaidPostsDTO = posts.map((post) => ({
      ...post,
      userMeetsRequirements: false,
    }));
    return _posts;
  }
}

const mapRaidPostToRaidPostResponse = (
  raidPost: RaidPost
): RaidPostResponse => {
  const { author, ...rest } = raidPost;
  const userResponse = mapUserToUserReponse(author);
  return { ...rest, author: userResponse };
};

const mapUserToUserReponse = (user: User): UserResponse => {
  const { apiKey, password, ...rest } = user;
  return rest;
};
