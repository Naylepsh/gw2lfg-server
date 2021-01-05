import { Inject, Service } from "typedi";
import { JoinRequest } from "@root/data/entities/join-request/join-request.entity";
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
      this.userRepo.findById(userId),
      this.postRepo.findById(postId),
      this.joinRequestRepo.findByKeys({ postId, roleId }),
    ]);
    const role = post?.getRole(roleId);

    if (!user) {
      throw new UserNotFoundError();
    }
    if (!post) {
      throw new PostNotFoundError();
    }
    if (!role) {
      throw new RoleNotFoundError();
    }
    if (requests.map((req) => req.user.id).includes(userId)) {
      throw new MultipleRequestsForTheSameSpotError();
    }
    if (
      requests.map((req) => req.status).some((status) => status === "ACCEPTED")
    ) {
      throw new SpotIsTakenError();
    }

    const areSatisfied = await this.checkRequirementsService.areRequirementsSatisfied(
      post.requirements,
      user
    );
    if (!areSatisfied) {
      throw new RequirementsNotSatisfiedError();
    }

    const joinRequest = new JoinRequest({ user, post, role });
    return this.joinRequestRepo.save(joinRequest);
  }
}
