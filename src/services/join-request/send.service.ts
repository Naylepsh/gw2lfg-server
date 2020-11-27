import { JoinRequest } from "../../core/entities/join-request";
import { Post } from "../../core/entities/post.entity";
import { ItemRequirement } from "../../core/entities/requirement.entity";
import { User } from "../../core/entities/user.entity";
import { IJoinRequestRepository } from "../../core/repositories/join-request.repository.interface";
import { IPostRepository } from "../../core/repositories/post.repository.interface";
import { IUserRepository } from "../../core/repositories/user.repository.interface";
import { ConcreteItemsFetcher } from "../gw2-api/gw2-api.service";
import { nameToId } from "../gw2-items/gw2-items.service";

export class SendJoinRequestService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly postRepo: IPostRepository,
    private readonly joinRequestRepo: IJoinRequestRepository,
    private readonly getItems: ConcreteItemsFetcher
  ) {}

  async sendJoinRequest(userId: number, postId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error();
    }

    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw new Error();
    }

    const _request = await this.joinRequestRepo.findByKey(userId, postId);
    if (_request) {
      throw new Error();
    }

    const areSatisfied = await this.areItemRequirementsSatisfied(post, user);
    if (!areSatisfied) {
      throw new Error();
    }

    const joinRequest = new JoinRequest({ userId, postId });
    return this.joinRequestRepo.save(joinRequest);
  }

  private async areItemRequirementsSatisfied(post: Post, user: User) {
    const requiredItems = post.requirements.filter(
      (req) => req instanceof ItemRequirement
    ) as ItemRequirement[];
    const requiredItemsIds = requiredItems.map((item) => nameToId(item.name));

    const userItems = await this.getItems.fetch(requiredItemsIds, user.apiKey);

    let areSatisfied = true;
    for (const userItem of userItems) {
      for (const requiredItem of requiredItems) {
        if (userItem.id === nameToId(requiredItem.name)) {
          if (userItem.count < requiredItem.quantity) {
            areSatisfied = false;
          }
        }
      }
    }
    return areSatisfied;
  }
}
