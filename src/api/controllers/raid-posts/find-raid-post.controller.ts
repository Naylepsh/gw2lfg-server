import {
  CurrentUser,
  Get,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { Inject } from "typedi";
import {
  findRaidPostsServiceType,
  requirementsCheckServiceType,
} from "@loaders/typedi.constants";
import { FindRaidPostsService } from "@services/raid-post/find-raid-posts.service";
import { ICheckRequirementsService } from "@services/requirement/check-requirements.service.interface";
import { User } from "@data/entities/user.entity";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { unsatisfyEachRequirement } from "./utils/unsatisfy-each-requirement";
import { checkIfUserMeetsPostsRequirements } from "./utils/check-if-user-meets-posts-requirements";
import { FindRaidPostResponse } from "./responses/find-raid-post.response";

@JsonController()
export class FindRaidPostController {
  constructor(
    @Inject(findRaidPostsServiceType)
    private readonly findService: FindRaidPostsService,
    @Inject(requirementsCheckServiceType)
    private readonly requirementsCheckService: ICheckRequirementsService
  ) {}

  @Get("/raid-posts/:id")
  async find(
    @Param("id") id: number,
    @CurrentUser() user?: User
  ): Promise<FindRaidPostResponse> {
    const query = { skip: 0, take: 1, where: { id } };
    const { posts } = await this.findService.find(query);
    if (posts.length === 0) {
      throw new NotFoundError();
    }

    const _posts = user
      ? await checkIfUserMeetsPostsRequirements(
          posts,
          user,
          this.requirementsCheckService
        )
      : unsatisfyEachRequirement(posts);
    return { data: _posts.map(mapRaidPostToRaidPostResponse)[0] };
  }
}
