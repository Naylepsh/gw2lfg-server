import { Action } from "routing-controllers";
import { User } from "../../data/entities/user.entity";
import { IUserRepository } from "../../data/repositories/user/user.repository.interface";
import { DecodeJWTService } from "../services/token/decode";

export interface ICurrentUserMiddleware {
  getCurrentUser(action: Action): Promise<User>;
}

export class CurrentUserJWTMiddleware {
  static readonly AUTH_HEADER = "x-auth-token";
  decodeTokenService = new DecodeJWTService();

  constructor(private readonly userRepo: IUserRepository) {}

  async getCurrentUser(action: Action) {
    try {
      const token = action.request.headers[
        CurrentUserJWTMiddleware.AUTH_HEADER
      ] as string;
      const decoded = this.decodeTokenService.decodeToken(token);
      const id = parseInt(decoded.id);
      return await this.userRepo.findById(id);
    } catch (e) {
      return null;
    }
  }
}
