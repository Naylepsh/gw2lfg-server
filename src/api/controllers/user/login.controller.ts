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
} from "@services/user/login";
import { CreateJwtService } from "../../services/token/create";

class LoginDTO {
  @MinLength(6)
  username: string;

  @MinLength(6)
  password: string;
}

@JsonController()
export class LoginUserController {
  authService = new CreateJwtService();

  constructor(private readonly loginService: LoginService) {}

  @Post("/login")
  async login(@Body({ validate: true }) dto: LoginDTO) {
    try {
      const user = await this.loginService.login(dto);
      const token = this.authService.createToken(user.id);
      return token;
    } catch (e) {
      if (e instanceof InvalidLoginDetailsError) {
        throw new UnauthorizedError(e.message);
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
