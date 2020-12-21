import { RaidPost } from "@data/entities/raid-post.entitity";
import { DTO } from "./dto";
import { mapUserToUserReponse, UserResponse } from "./user.entity.response";

type RaidPostDTO = DTO<RaidPost>;

export type RaidPostResponse = Omit<RaidPostDTO, "author"> & {
  author: UserResponse;
};

export const mapRaidPostToRaidPostResponse = <R extends RaidPostDTO>(
  raidPost: R
) => {
  const { author, ...rest } = raidPost;
  const userResponse = mapUserToUserReponse(author);
  return { ...rest, author: userResponse };
};
