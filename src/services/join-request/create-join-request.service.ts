import { Inject, Service } from "typedi";
import { JoinRequest } from "@data/entities/join-request/join-request.entity";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import {
  joinRequestRepositoryType,
  postRepositoryType,
  requirementsCheckServiceType,
  userRepositoryType,
} from "@loaders/typedi.constants";
import {
  PostNotFoundError,
  RoleNotFoundError,
  UserNotFoundError,
} from "../common/errors/entity-not-found.error";
import { ICheckRequirementsService } from "../requirement/check-requirements.service.interface";
import { CreateJoinRequestDTO } from "./dtos/create-join-request.dto";
import { RequirementsNotSatisfiedError } from "./errors/requirements-not-satisfied.error";
import { MultipleRequestsForTheSameSpotError } from "./errors/multiple-requests-for-the-same-spot.error";
import { SpotIsTakenError } from "./errors/spot-is-taken.error";
import { User } from "@data/entities/user/user.entity";
import { Post } from "@data/entities/post/post.entity";
import { Role } from "@data/entities/role/role.entity";
import { SignUpsTimeEndedError } from "./errors/signs-ups-time-ended.error";
import { byId } from "@root/data/queries/common.queries";
import { byJoinRequestRelations } from "@root/data/queries/join-request.queries";

/**
 * Service for creation of join requests.
 * Checks whether given join request is valid and if so, stores it in database.
 */
@Service()
export class CreateJoinRequestService {
  constructor(
    @Inject(userRepositoryType) private readonly userRepo: IUserRepository,
    @Inject(postRepositoryType) private readonly postRepo: IPostRepository,
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository,
    @Inject(requirementsCheckServiceType)
    private readonly checkRequirementsService: ICheckRequirementsService
  ) {}

  async create({ userId, postId, roleId }: CreateJoinRequestDTO) {
    const [user, post, requests] = await Promise.all([
      this.userRepo.findOne(byId(userId)),
      this.postRepo.findOne(byId(postId)),
      this.joinRequestRepo.findMany(byJoinRequestRelations({ postId })),
    ]);
    const role = post?.getRole(roleId);

    await this.ensureJoinRequestCanBeCreated(user, post, role, requests);

    const joinRequest = new JoinRequest({
      user: user!,
      post: post!,
      role: role!,
    });
    return this.joinRequestRepo.save(joinRequest);
  }

  private async ensureJoinRequestCanBeCreated(
    user: User | undefined,
    post: Post | undefined,
    role: Role | undefined,
    requests: JoinRequest[]
  ) {
    this.ensureAllEntitiesWereFound(user, post, role);
    this.ensureSignupsAreAvailable(post!);
    await this.ensureUserCanTakeTheSpot(requests, user!, post!, role!.id);
  }

  private async ensureUserCanTakeTheSpot(
    requests: JoinRequest[],
    user: User,
    post: Post,
    roleId: number
  ) {
    const requestsForRole = requests.filter((r) => r.id === roleId);
    this.ensureUserHasNotRequestedTheSameSpot(requestsForRole, user);
    this.ensureTheSpotIsNotTaken(requests);
    if (requests.length === 0) {
      await this.ensureUserMeetsRequirements(post, user);
    }
  }

  private ensureSignupsAreAvailable(post: Post) {
    if (post.date < new Date()) {
      throw new SignUpsTimeEndedError();
    }
  }

  private async ensureUserMeetsRequirements(post: Post, user: User) {
    const [areSatisfied] =
      await this.checkRequirementsService.doesUserSatisfyPostsRequirements(
        [post],
        user
      );
    if (!areSatisfied) {
      throw new RequirementsNotSatisfiedError();
    }
  }

  private ensureTheSpotIsNotTaken(requests: JoinRequest[]) {
    if (
      requests.map((req) => req.status).some((status) => status === "ACCEPTED")
    ) {
      throw new SpotIsTakenError();
    }
  }

  private ensureUserHasNotRequestedTheSameSpot(
    requests: JoinRequest[],
    user: User
  ) {
    if (requests.map((req) => req.user.id).includes(user.id)) {
      throw new MultipleRequestsForTheSameSpotError();
    }
  }

  // if any of the given ids of related object points to no object - throw a corresponding NotFound error
  private ensureAllEntitiesWereFound(
    user: User | undefined,
    post: Post | undefined,
    role: Role | undefined
  ) {
    if (!user) {
      throw new UserNotFoundError();
    }
    if (!post) {
      throw new PostNotFoundError();
    }
    if (!role) {
      throw new RoleNotFoundError();
    }
  }
}
