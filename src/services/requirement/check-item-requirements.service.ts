import { Inject, Service } from "typedi";
import { User } from "@data/entities/user/user.entity";
import { types } from "@loaders/typedi.constants";
import { ICheckRequirementsService } from "./check-requirements.service.interface";
import { FindUserItemsService } from "../user/find-user-items.service";
import { Post } from "@data/entities/post/post.entity";

/**
 * Service for checking whether given requirements are satisfied by given user.
 */
@Service(types.services.requirementsCheck)
export class CheckItemRequirementsService implements ICheckRequirementsService {
  constructor(
    @Inject(types.services.findUserItems)
    private readonly findUserItemsService: FindUserItemsService
  ) {}

  async doesUserSatisfyPostsRequirements(
    posts: Post[],
    user: User
  ): Promise<boolean[]> {
    const userItems = await this.findUserItemsService.find({ id: user.id });
    return posts.map((post) => post.hasItemRequirementsSatisfiedBy(userItems));
  }
}
