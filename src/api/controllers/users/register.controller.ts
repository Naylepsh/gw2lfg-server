import {
  Body,
  HttpCode,
  InternalServerError,
  JsonController,
  OnUndefined,
  Post,
} from "routing-controllers";
import { User } from "@data/entities/user.entity";
import { RegisterService } from "@services/user/register";
import { UsernameTakenError } from "@root/services/user/errors/username-taken.error";
import { UnprocessableEntityError } from "../../http-errors/unprocessable-entity.error";
import { CreateJwtService } from "../../services/token/create";
import { RegisterDTO } from "./dtos/register.dto";
import { RegisterResponse } from "./responses/register.response";

@JsonController()
export class RegisterUserController {
  authService = new CreateJwtService();
  constructor(private readonly registerService: RegisterService) {}

  @HttpCode(201)
  @OnUndefined(201)
  @Post("/register")
  async register(
    @Body({ validate: true }) dto: RegisterDTO
  ): Promise<RegisterResponse> {
    try {
      const user = new User(dto);
      const registeredUser = await this.registerService.register(user);
      const token = this.authService.createToken(registeredUser.id);
      return { data: { token } };
    } catch (e) {
      if (e instanceof UsernameTakenError) {
        throw new UnprocessableEntityError(e.message);
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
