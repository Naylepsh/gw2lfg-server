import {
  Body,
  InternalServerError,
  JsonController,
  Post,
  UnauthorizedError,
} from "routing-controllers";
import { LoginService } from "@services/user/login";
import { InvalidLoginDetailsError } from "@root/services/user/errors/invalid-login-details.error";
import { CreateJwtService } from "../../services/token/create";
import { LoginDTO } from "./login.dto";
import { LoginResponse } from "./login.response";

@JsonController()
export class LoginUserController {
  authService = new CreateJwtService();

  constructor(private readonly loginService: LoginService) {}

  @Post("/login")
  async login(@Body({ validate: true }) dto: LoginDTO): Promise<LoginResponse> {
    try {
      const user = await this.loginService.login(dto);
      const token = this.authService.createToken(user.id);
      return { data: { token } };
    } catch (e) {
      if (e instanceof InvalidLoginDetailsError) {
        throw new UnauthorizedError(e.message);
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
