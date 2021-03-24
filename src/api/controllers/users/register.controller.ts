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
import { ConflictError } from "../../http-errors/conflict.error";
import { createToken } from "../../utils/token/create";
import { RegisterDTO } from "./dtos/register.dto";
import { RegisterResponse } from "./responses/register.response";
import { mapUserToUserResponse } from "../../responses/entities/user.entity.response";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for POST /register
 * Registers an user in the database if provided data is valid.
 * Returns created resource and jwt associated with the user on success.
 */
@JsonController()
export class RegisterUserController {
  constructor(private readonly registerService: RegisterService) {}

  @HttpCode(201)
  @OnUndefined(201)
  @Post("/register")
  async handleRequest(@Body() dto: RegisterDTO): Promise<RegisterResponse> {
    try {
      return await this.register(dto);
    } catch (e) {
      throw this.mapError(e);
    }
  }

  private async register(dto: RegisterDTO) {
    const user = new User(dto);
    const registeredUser = await this.registerService.register(user);
    const token = createToken(registeredUser.id);

    return { data: { token, user: mapUserToUserResponse(registeredUser) } };
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof UsernameTakenError) {
      throw new ConflictError(message);
    } else if (error instanceof InvalidApiKeyError) {
      throw new BadRequestError(message);
    } else {
      throw new InternalServerError(message);
    }
  }
}
