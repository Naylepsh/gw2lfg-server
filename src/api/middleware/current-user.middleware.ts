import { Action } from "routing-controllers";
import { Inject } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { userRepositoryType } from "@loaders/typedi.constants";
import { Jwt } from "../utils/token/jwt";

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

      const user = await this.userRepo.findOne({ where: { id: token.id } });

      // middleware has to return null to trigger failure
      return user ?? null;
    } catch (e) {
      return null;
    }
  }

  private getToken(action: Action) {
    const tokenString = this.getTokenStringFromHeaders(action);

    const jwt = Jwt.fromString(tokenString);
    if (jwt.hasExpired()) {
      throw new Error("Token has expired");
    }

    return jwt;
  }

  private getTokenStringFromHeaders(action: Action) {
    const authToken = action.request?.headers?.authorization as string;
    const tokenType = "Bearer ";
    if (!authToken || !authToken.startsWith(tokenType)) {
      throw new Error("No token found");
    }

    const tokenString = authToken.slice(tokenType.length);

    return tokenString;
  }
}
