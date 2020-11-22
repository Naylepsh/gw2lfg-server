import { JoinRequest } from "../../entities/join-request";
import { ItemRequirement } from "../../entities/requirement.entity";
import { IJoinRequestRepository } from "../../repositories/join-request.repository";
import { IPostRepository } from "../../repositories/post.repository";
import { IUserRepository } from "../../repositories/user.repository";
import { ConcreteItemsFetcher } from "../gw2-api/gw2-api.service";
import { nameToId } from "../gw2-items/gw2-items.service";

export const sendJoinRequest = async (
  userId: number,
  postId: number,
  userRepo: IUserRepository,
  postRepo: IPostRepository,
  joinRequestRepo: IJoinRequestRepository,
  getItems: ConcreteItemsFetcher
) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new Error();
  }

  const post = await postRepo.findById(postId);
  if (!post) {
    throw new Error();
  }

  const _request = await joinRequestRepo.findByKey(userId, postId);
  if (_request) {
    throw new Error();
  }

  const requiredItems = post.requirements.filter(
    (req) => req instanceof ItemRequirement
  ) as ItemRequirement[];
  const requiredItemsIds = requiredItems.map((item) => nameToId(item.name));
  const userItems = await getItems(requiredItemsIds, user.apiKey);
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
  if (!areSatisfied) {
    throw new Error();
  }

  const joinRequest = new JoinRequest({ userId, postId });
  return joinRequestRepo.save(joinRequest);
};
