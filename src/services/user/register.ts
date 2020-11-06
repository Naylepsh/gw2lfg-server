import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../repositories/user.repository";
import { Hash } from "../../utils/hashing/hashing.types";

export class UsernameTakenError extends Error {}

export const register = async (
  user: User,
  userRepository: IUserRepository,
  hash: Hash
) => {
  if (await isUsernameTaken(userRepository, user.username)) {
    throw new UsernameTakenError();
  }

  const _user = { ...user };
  await hashUserPassword(hash, _user);
  await userRepository.save(_user);
};

const isUsernameTaken = async (
  userRepository: IUserRepository,
  username: string
) => {
  return !!(await userRepository.findByUsername(username));
};

const hashUserPassword = async (hash: Hash, user: User) => {
  const hashedPassword = await hash(user.password);
  user.password = hashedPassword;
};
