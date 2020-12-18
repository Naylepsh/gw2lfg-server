import { User } from "@data/entities/user.entity";
import { DTO } from "./dto";

type UserDTO = DTO<User>;

export type UserResponse = Omit<UserDTO, "password" | "apiKey">;

export const mapUserToUserReponse = <U extends UserDTO>(
  user: U
): UserResponse => {
  const { apiKey, password, ...rest } = user;
  return rest;
};
