import { UserDTO } from "../dtos/user.dto";

export type UserResponse = Omit<UserDTO, "password" | "apiKey">;

export const mapUserToUserReponse = <U extends UserDTO>(
  user: U
): UserResponse => {
  const { apiKey, password, ...rest } = user;
  return rest;
};
