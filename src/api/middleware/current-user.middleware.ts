import { Action } from "routing-controllers";
import { Inject } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { userRepositoryType } from "@loaders/typedi.constants";
import { decodeToken } from "../utils/token/decode";

/**
 * Middleware for dealing with jwt based authentication.
 * Decodes the jwt and returns a user associated with it from the database.
 */
export class CurrentUserJWTMiddleware {
  constructor(
    @Inject(userRepositoryType) private readonly userRepo: IUserRepository
  ) {}

  async getCurrentUser(action: Action) {
    try {
      const authToken = action.request.headers["authorization"] as string;
      const tokenType = "Bearer ";
      if (!authToken || !authToken.startsWith(tokenType)) {
        return null;
      }

      const token = authToken.slice(tokenType.length);

      const decoded = decodeToken(token as string);
      const id = parseInt(decoded.id);
      const user = await this.userRepo.findOne({ where: { id } });

      // middleware has to return null to trigger failure
      return user ?? null;
    } catch (e) {
      return null;
    }
  }
}
