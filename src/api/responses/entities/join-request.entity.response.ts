import { ItemRequirement } from "../../../data/entities/item-requirement/item.requirement.entity";
import { JoinRequest } from "../../../data/entities/join-request/join-request.entity";
import { DTO } from "./dto";
import { mapUserToUserResponse, UserResponse } from "./user.entity.response";

type JoinRequestDTO = DTO<JoinRequest>;

export type JoinRequestResponse = Omit<JoinRequestDTO, "user"> & {
  user: UserResponse;
};

export const mapJoinRequestToJoinRequestResponse = <R extends JoinRequestDTO>(
  joinRequest: R
) => {
  const { user, ...rest } = joinRequest;
  const userResponse = mapUserToUserResponse(user);
  return {
    ...rest,
    user: userResponse,
  };
};
