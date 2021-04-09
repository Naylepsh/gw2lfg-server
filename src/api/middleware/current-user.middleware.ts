import { Action } from "routing-controllers";
import { Inject } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { userRepositoryType } from "@loaders/typedi.constants";
import { decodeToken } from "../utils/token/jwt";

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
      const token = this.getToken(action);
      const decoded = decodeToken(token as string);
      if (decoded.hasExpired()) {
        throw new Error("Token has expired");
      }

      const id = decoded.id;
      const user = await this.userRepo.findOne({ where: { id } });

      // middleware has to return null to trigger failure
      return user ?? null;
    } catch (e) {
      return null;
    }
  }

  private getToken(action: Action) {
    const authToken = action.request.headers["authorization"] as string;
    const tokenType = "Bearer ";
    if (!authToken || !authToken.startsWith(tokenType)) {
      throw new Error("No token found");
    }

    const token = authToken.slice(tokenType.length);

    return token;
  }
}
