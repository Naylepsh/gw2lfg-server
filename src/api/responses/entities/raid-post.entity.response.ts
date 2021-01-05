import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { ItemRequirement } from "../../../data/entities/item-requirement/item.requirement.entity";
import { DTO } from "./dto";
import { mapUserToUserReponse, UserResponse } from "./user.entity.response";

type RaidPostDTO = DTO<RaidPost>;

export type RaidPostResponse = Omit<RaidPostDTO, "author" | "requirements"> & {
  author: UserResponse;
  requirements: {
    items: ItemRequirement[];
  };
};

export const mapRaidPostToRaidPostResponse = <R extends RaidPostDTO>(
  raidPost: R
) => {
  const { author, requirements, ...rest } = raidPost;
  const itemRequirements = requirements.filter(
    (req) => req instanceof ItemRequirement
  ) as ItemRequirement[];
  const userResponse = mapUserToUserReponse(author);
  return {
    ...rest,
    author: userResponse,
    requirements: { items: itemRequirements },
  };
};
