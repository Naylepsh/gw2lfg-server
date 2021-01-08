import { User } from "@root/data/entities/user/user.entity";
import { DTO } from "./dto";

// User without methods
type UserDTO = DTO<User>;

// User without methods and without confidential user data
export type UserResponse = Omit<UserDTO, "password" | "apiKey">;

/*
Strips methods from user leaving only fields.
Removes confidential user information.
*/
export const mapUserToUserResponse = <U extends UserDTO>(
  user: U
): UserResponse => {
  const { apiKey, password, ...rest } = user;

  return rest;
};
