import { User } from "../../../../entities/user.entity";
import { IUserRepository } from "../../../../repositories/user.repository";

export type CreateAndSaveUser = (
  username: string,
  password?: string,
  apiKey?: string
) => Promise<User>;

export const createAndSaveUserWithRepository = (
  repository: IUserRepository
): CreateAndSaveUser => (
  username: string,
  password: string = "password",
  apiKey: string = "api-key"
) => {
  const author = new User(username, password, apiKey);
  return repository.save(author);
};
