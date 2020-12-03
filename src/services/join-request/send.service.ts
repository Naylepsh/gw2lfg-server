import { JoinRequest } from "../../data/entities/join-request";
import { IJoinRequestRepository } from "../../data/repositories/join-request/join-request.repository.interface";
import { IPostRepository } from "../../data/repositories/post/post.repository.interface";
import { IUserRepository } from "../../data/repositories/user/user.repository.interface";
import { EntityAlreadyExistsError } from "../errors/entity-already-exists.error";
import {
  PostNotFoundError,
  UserNotFoundError,
} from "../errors/entity-not-found.error";
import { ICheckRequirementsService } from "../requirement/check-requirements.service.interface";

interface SendJoinRequestDTO {
  userId: number;
  postId: number;
}

export class RequirementsNotSatisfiedError extends Error {}

export class SendJoinRequestService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly postRepo: IPostRepository,
    private readonly joinRequestRepo: IJoinRequestRepository,
    private readonly checkRequirementsService: ICheckRequirementsService
  ) {}

  async sendJoinRequest({ userId, postId }: SendJoinRequestDTO) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw new PostNotFoundError();
    }

    const _request = await this.joinRequestRepo.findByKey(userId, postId);
    if (_request) {
      throw new EntityAlreadyExistsError();
    }

    const areSatisfied = await this.checkRequirementsService.areRequirementsSatisfied(
      post.requirements,
      user
    );
    if (!areSatisfied) {
      throw new RequirementsNotSatisfiedError();
    }

    const joinRequest = new JoinRequest({ userId, postId });
    return this.joinRequestRepo.save(joinRequest);
  }
}
