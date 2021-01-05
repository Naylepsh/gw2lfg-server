import {
  CurrentUser,
  Get,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
} from "routing-controllers";
import { Inject } from "typedi";
import {
  findRaidPostServiceType,
  requirementsCheckServiceType,
} from "@loaders/typedi.constants";
import { ICheckRequirementsService } from "@services/requirement/check-requirements.service.interface";
import { FindRaidPostService } from "@services/raid-post/find-raid-post.service";
import { User } from "@root/data/entities/user/user.entity";
import { mapRaidPostToRaidPostResponse } from "../../responses/entities/raid-post.entity.response";
import { unsatisfyEachRequirement } from "./utils/unsatisfy-each-requirement";
import { checkIfUserMeetsPostsRequirements } from "./utils/check-if-user-meets-posts-requirements";
import { FindRaidPostResponse } from "./responses/find-raid-post.response";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";

@JsonController()
export class FindRaidPostController {
  constructor(
    @Inject(findRaidPostServiceType)
    private readonly findService: FindRaidPostService,
    @Inject(requirementsCheckServiceType)
    private readonly requirementsCheckService: ICheckRequirementsService
  ) {}

  @Get("/raid-posts/:id")
  async find(
    @Param("id") id: number,
    @CurrentUser() user?: User
  ): Promise<FindRaidPostResponse> {
    try {
      const post = await this.findService.find({ id });

      const posts = user
        ? await checkIfUserMeetsPostsRequirements(
            [post],
            user,
            this.requirementsCheckService
          )
        : unsatisfyEachRequirement([post]);
      return { data: posts.map(mapRaidPostToRaidPostResponse)[0] };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError();
      } else {
        throw new InternalServerError(error.message);
      }
    }
  }
}
