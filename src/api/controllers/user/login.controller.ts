import { MinLength } from "class-validator";
import {
  Body,
  InternalServerError,
  JsonController,
  Post,
  UnauthorizedError,
} from "routing-controllers";
import {
  InvalidLoginDetailsError,
  LoginService,
} from "../../../services/user/login";

class LoginDTO {
  @MinLength(6)
  username: string;

  @MinLength(6)
  password: string;
}

@JsonController()
export class LoginUserController {
  constructor(private readonly loginService: LoginService) {}

  @Post("/login")
  async login(@Body({ validate: true }) dto: LoginDTO) {
    try {
      return await this.loginService.login(dto);
    } catch (e) {
      if (e instanceof InvalidLoginDetailsError) {
        throw new UnauthorizedError(e.message);
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
