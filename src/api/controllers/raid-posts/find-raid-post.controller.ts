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

/*
Controller for GET /raid-posts/:id requests.
Returns a post with matching id or throws 404 if post could not be found.
Providing user token will check whether that user meets the post's requirements to join
but it's not required.
*/
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

      // checkIfUserMeetsPostsRequirements takes and returns a post array
      // if user is not authenticated we say that they fail to meet the requirements
      // otherwise we properly check
      const posts = user
        ? await checkIfUserMeetsPostsRequirements(
            [post],
            user,
            this.requirementsCheckService
          )
        : unsatisfyEachRequirement([post]);
      const postWithRequirementsChecked = posts[0];

      return {
        data: mapRaidPostToRaidPostResponse(postWithRequirementsChecked),
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError();
      } else {
        throw new InternalServerError(error.message);
      }
    }
  }
}
