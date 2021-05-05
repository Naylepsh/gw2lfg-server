import { User } from "../../entities/user/user.entity";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findOne(params: UserQueryParams): Promise<User | undefined>;
  delete(criteria?: any): Promise<void>;
}

export interface UserQueryParams {
  where?: {
    id?: number;
    username?: string;
    apiKey?: string;
  };
}
