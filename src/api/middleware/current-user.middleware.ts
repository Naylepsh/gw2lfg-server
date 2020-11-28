import { Action } from "routing-controllers";
import { IUserRepository } from "../../data/repositories/user/user.repository.interface";

export class CurrentUserMiddleware {
  static readonly AUTH_HEADER = "x-auth-token";

  constructor(private readonly userRepo: IUserRepository) {}

  async getCurrentUser(action: Action) {
    const token = action.request.headers[
      CurrentUserMiddleware.AUTH_HEADER
    ] as string;
    // TODO: change it to jwt
    const id = parseInt(token);
    return await this.userRepo.findById(id);
  }
}
