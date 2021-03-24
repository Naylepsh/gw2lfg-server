import {
  Body,
  InternalServerError,
  JsonController,
  Post,
  UnauthorizedError,
} from "routing-controllers";
import { LoginService } from "@root/services/user/login.service";
import { InvalidLoginDetailsError } from "@root/services/user/errors/invalid-login-details.error";
import { createToken } from "../../utils/token/create";
import { LoginDTO } from "./dtos/login.dto";
import { LoginResponse } from "./responses/login.response";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for POST /login
 * Checks whether a user with matching username and password exists in database.
 * Returns a jwt associated with the user on success.
 */
@JsonController()
export class LoginUserController {
  constructor(private readonly loginService: LoginService) {}

  @Post("/login")
  async handleRequest(@Body() dto: LoginDTO): Promise<LoginResponse> {
    try {
      return await this.login(dto);
    } catch (e) {
      throw this.mapError(e);
    }
  }

  private async login(dto: LoginDTO) {
    const user = await this.loginService.login(dto);
    const token = createToken(user.id);

    return { data: { token } };
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof InvalidLoginDetailsError) {
      throw new UnauthorizedError(message);
    } else {
      throw new InternalServerError(message);
    }
  }
}
