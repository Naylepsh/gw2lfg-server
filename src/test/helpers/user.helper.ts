import { User } from "../../data/entities/user.entity";
import { IUserRepository } from "../../data/repositories/user/user.repository.interface";

interface UserProps {
  username: string;
  password?: string;
  apiKey?: string;
}

export const createAndSaveUser = (
  repository: IUserRepository,
  userProps: UserProps
) => {
  const author = createUser(userProps);
  return repository.save(author);
};

export const createUser = (userProps: UserProps) => {
  const props = {
    username: userProps.username,
    password: userProps.password ?? "password",
    apiKey: userProps.apiKey ?? "api-key",
  };
  const author = new User(props);
  return author;
};

export const createDummyUser = () => {
  return createUser({ username: "username" });
};
