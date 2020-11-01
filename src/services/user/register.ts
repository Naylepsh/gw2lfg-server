import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../repositories/user.repository";
import { Hash } from "../../utils/hashing/hashing.types";

export class UsernameTakenError extends Error {}

export const register = async (
  user: User,
  userRepository: IUserRepository,
  hash: Hash
) => {
  const isUsernameTaken =
    (await userRepository.findByUsername(user.username)) !== undefined;
  if (isUsernameTaken) {
    throw new UsernameTakenError();
  }

  const hashedPassword = await hash(user.password);
  const hashedUser = new User(user.username, hashedPassword, user.apiKey);
  await userRepository.save(hashedUser);
};
