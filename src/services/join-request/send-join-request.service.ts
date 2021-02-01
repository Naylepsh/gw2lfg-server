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
import { SendJoinRequestDTO } from "./dtos/send-join-request.dto";
import { RequirementsNotSatisfiedError } from "./errors/requirements-not-satisfied.error";
import { MultipleRequestsForTheSameSpotError } from "./errors/multiple-requests-for-the-same-spot.error";
import { SpotIsTakenError } from "./errors/spot-is-taken.error";
import { User } from "@data/entities/user/user.entity";
import { Post } from "@data/entities/post/post.entity";
import { Role } from "@data/entities/role/role.entity";
import { SignUpsTimeEndedError } from "./errors/signs-ups-time-ended.error";

/*
Service for creation of join requests.
Checks whether given join request is valid and if so, stores it in database.
*/
@Service()
export class SendJoinRequestService {
  constructor(
    @Inject(userRepositoryType) private readonly userRepo: IUserRepository,
    @Inject(postRepositoryType) private readonly postRepo: IPostRepository,
    @Inject(joinRequestRepositoryType)
    private readonly joinRequestRepo: IJoinRequestRepository,
    @Inject(requirementsCheckServiceType)
    private readonly checkRequirementsService: ICheckRequirementsService
  ) {}

  async sendJoinRequest({ userId, postId, roleId }: SendJoinRequestDTO) {
    const [user, post, requests] = await Promise.all([
      this.userRepo.findOne({ where: { id: userId } }),
      this.postRepo.findOne({
        where: { id: postId },
        relations: ["roles", "requirements"],
      }),
      this.joinRequestRepo.findByKeys({ postId, roleId }),
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
    await this.ensureUserCanTakeTheSpot(requests, user!, post!);
  }

  private async ensureUserCanTakeTheSpot(
    requests: JoinRequest[],
    user: User,
    post: Post
  ) {
    if (post.date < new Date()) {
      throw new SignUpsTimeEndedError();
    }
    this.ensureUserHasNotTakenTheSameSpot(requests, user);
    this.ensureTheSpotIsNotTaken(requests);
    await this.ensureUserMeetsRequirements(post, user);
  }

  private async ensureUserMeetsRequirements(post: Post, user: User) {
    const [
      areSatisfied,
    ] = await this.checkRequirementsService.areRequirementsSatisfied(
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

  private ensureUserHasNotTakenTheSameSpot(
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
