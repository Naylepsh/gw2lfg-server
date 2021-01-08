import {
  BadRequestError,
  Body,
  HttpCode,
  InternalServerError,
  JsonController,
  OnUndefined,
  Post,
} from "routing-controllers";
import { User } from "@data/entities/user/user.entity";
import { RegisterService } from "@services/user/register.service";
import { UsernameTakenError } from "@services/user/errors/username-taken.error";
import { InvalidApiKeyError } from "@services/user/errors/invalid-api-key.error";
import { UnprocessableEntityError } from "../../http-errors/unprocessable-entity.error";
import { CreateJwtService } from "../../services/token/create";
import { RegisterDTO } from "./dtos/register.dto";
import { RegisterResponse } from "./responses/register.response";
import { mapUserToUserResponse } from "../../responses/entities/user.entity.response";

/*
Controller for POST /register
Registers an user in the database if provided data is valid.
Returns created resource and jwt on success.
*/
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
      return { data: { token, user: mapUserToUserResponse(registeredUser) } };
    } catch (e) {
      if (e instanceof UsernameTakenError) {
        throw new UnprocessableEntityError(e.message);
      } else if (e instanceof InvalidApiKeyError) {
        throw new BadRequestError("Invalid api key");
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
