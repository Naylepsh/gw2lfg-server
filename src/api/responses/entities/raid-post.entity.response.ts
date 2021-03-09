import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { ItemRequirement } from "../../../data/entities/item-requirement/item.requirement.entity";
import { DTO } from "./dto";
import { mapUserToUserResponse, UserResponse } from "./user.entity.response";

// Raid Post without methods
type RaidPostDTO = DTO<RaidPost>;

/**
 * Raid Post without methods and without confidential user data
 * but with categorized requirements
 */
export type RaidPostResponse = Omit<RaidPostDTO, "author" | "requirements"> & {
  author: UserResponse;
  requirements: {
    items: ItemRequirement[];
  };
};

/**
 * Strips methods from raid post leaving only fields.
 * Removes confidential user information.
 * Categorizes requirements.
 */
export const mapRaidPostToRaidPostResponse = <R extends RaidPostDTO>(
  raidPost: R
) => {
  const { author, requirements, ...rest } = raidPost;

  const itemRequirements = requirements.filter(
    (req) => req instanceof ItemRequirement
  ) as ItemRequirement[];

  const userResponse = mapUserToUserResponse(author);

  return {
    ...rest,
    author: userResponse,
    requirements: { items: itemRequirements },
  };
};
