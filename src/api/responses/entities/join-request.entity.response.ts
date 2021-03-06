import { JoinRequest } from "@data/entities/join-request/join-request.entity";
import { DTO } from "./dto";
import { mapUserToUserResponse, UserResponse } from "./user.entity.response";

// Join Request without methods
type JoinRequestDTO = DTO<JoinRequest>;

// Join Request without methods and without confidential user data
export type JoinRequestResponse = Omit<JoinRequestDTO, "user"> & {
  user: UserResponse;
};

/**
 * Strips methods from join request leaving only fields.
 * Removes confidential user information
 */
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
