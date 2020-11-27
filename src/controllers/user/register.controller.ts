import { MinLength } from "class-validator";
import {
  Body,
  HttpCode,
  HttpError,
  InternalServerError,
  JsonController,
  OnUndefined,
  Post,
} from "routing-controllers";
import { User } from "../../entities/user.entity";
import {
  RegisterService,
  UsernameTakenError,
} from "../../services/user/register";

class RegisterDTO {
  @MinLength(6)
  username: string;

  @MinLength(6)
  password: string;

  @MinLength(1)
  apiKey: string;
}

class UnprocessableEntityError extends HttpError {
  constructor(public readonly message: string) {
    super(422);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }

  toJSON() {
    return {
      status: this.httpCode,
      message: this.message,
    };
  }
}

@JsonController()
export class RegisterUserController {
  constructor(private readonly registerService: RegisterService) {}

  @HttpCode(201)
  @OnUndefined(201)
  @Post("/register")
  async register(@Body({ validate: true }) dto: RegisterDTO) {
    const user = new User({ ...dto });
    try {
      return await this.registerService.register(user);
    } catch (e) {
      if (e instanceof UsernameTakenError) {
        throw new UnprocessableEntityError(e.message);
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
