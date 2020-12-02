import { MinLength } from "class-validator";
import * as jwt from "jsonwebtoken";
import {
  Body,
  HttpCode,
  InternalServerError,
  JsonController,
  OnUndefined,
  Post,
} from "routing-controllers";
import { config } from "../../../config";
import { User } from "../../../data/entities/user.entity";
import {
  RegisterService,
  UsernameTakenError,
} from "../../../services/user/register";
import { UnprocessableEntityError } from "../../http-errors/unprocessable-entity.error";

class RegisterDTO {
  @MinLength(6)
  username: string;

  @MinLength(6)
  password: string;

  @MinLength(1)
  apiKey: string;
}

@JsonController()
export class RegisterUserController {
  constructor(private readonly registerService: RegisterService) {}

  @HttpCode(201)
  @OnUndefined(201)
  @Post("/register")
  async register(@Body({ validate: true }) dto: RegisterDTO) {
    try {
      const user = new User({ ...dto });
      const registeredUser = await this.registerService.register(user);
      const token = jwt.sign(
        { id: registeredUser.id },
        config.jwt.secret,
        config.jwt.options
      );
      return token;
    } catch (e) {
      if (e instanceof UsernameTakenError) {
        throw new UnprocessableEntityError(e.message);
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
