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
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";

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

    // if any of the given ids of related object points to no object - throw a corresponding NotFound error
    if (!user) {
      throw new UserNotFoundError();
    }
    if (!post) {
      throw new PostNotFoundError();
    }
    if (!role) {
      throw new RoleNotFoundError();
    }
    // user cannot request the same spot twice
    if (requests.map((req) => req.user.id).includes(userId)) {
      throw new MultipleRequestsForTheSameSpotError();
    }
    // user cannot request a spot that is already taken by someone
    if (
      requests.map((req) => req.status).some((status) => status === "ACCEPTED")
    ) {
      throw new SpotIsTakenError();
    }

    // user has to satisfy post's requirements to join
    const [
      areSatisfied,
    ] = await this.checkRequirementsService.areRequirementsSatisfied(
      [post as RaidPost],
      user
    );
    if (!areSatisfied) {
      throw new RequirementsNotSatisfiedError();
    }

    const joinRequest = new JoinRequest({ user, post, role });
    return this.joinRequestRepo.save(joinRequest);
  }
}
