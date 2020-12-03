import { IsOptional, IsPositive } from "class-validator";
import {
  // CurrentUser,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers";
import { RaidPost } from "../../../data/entities/raid-post.entitity";
// import { User } from "../../../data/entities/user.entity";
import { FindRaidPostService } from "../../../services/raid-post/find.service";

type FindSingleRaidPostDTO = RaidPost & { userMeetsRequirements: boolean };
type FindRaidPostsDTO = FindSingleRaidPostDTO[];

class FindRaidPostsQueryParams {
  @IsOptional()
  @IsPositive()
  take?: number;

  @IsOptional()
  @IsPositive()
  skip?: number;
}

@JsonController()
export class FindRaidPostsController {
  constructor(private readonly service: FindRaidPostService) {}

  @Get("/raid-posts")
  async findAll(
    @QueryParams() query: FindRaidPostsQueryParams
    // @CurrentUser() user?: User,
  ): Promise<FindRaidPostsDTO> {
    const posts = await this.service.find(query);
    const _posts = posts.map((post) => ({
      ...post,
      userMeetsRequirements: false,
    }));
    return _posts;
  }
}
