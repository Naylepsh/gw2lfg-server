import { JoinRequest } from "../../entities/join-request";
import { IJoinRequestRepository } from "../../repositories/join-request.repository";
import { IPostRepository } from "../../repositories/post.repository";
import { IUserRepository } from "../../repositories/user.repository";

export const sendJoinRequest = async (
  userId: number,
  postId: number,
  userRepo: IUserRepository,
  postRepo: IPostRepository,
  joinRequestRepo: IJoinRequestRepository
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

  const joinRequest = new JoinRequest({ userId, postId });
  return joinRequestRepo.save(joinRequest);
};
