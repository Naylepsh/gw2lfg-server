import { RaidPostDTO } from "../dtos/raid-post.dto";
import { mapUserToUserReponse, UserResponse } from "./user.response";

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
