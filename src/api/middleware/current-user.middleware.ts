import { Action } from "routing-controllers";
import { Inject } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { userRepositoryType } from "@loaders/typedi.constants";
import { DecodeJWTService } from "../services/token/decode";

export class CurrentUserJWTMiddleware {
  static readonly AUTH_HEADER = "gw2lfg-auth-token";
  decodeTokenService = new DecodeJWTService();

  constructor(
    @Inject(userRepositoryType) private readonly userRepo: IUserRepository
  ) {}

  async getCurrentUser(action: Action) {
    try {
      const token =
        action.request.headers[CurrentUserJWTMiddleware.AUTH_HEADER];
      if (!token) {
        return null;
      }

      const decoded = this.decodeTokenService.decodeToken(token as string);
      const id = parseInt(decoded.id);
      const user = await this.userRepo.findById(id);
      return user ?? null;
    } catch (e) {
      return null;
    }
  }
}
