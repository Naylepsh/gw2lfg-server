import {
  BadRequestError,
  Body,
  CurrentUser,
  ForbiddenError,
  HttpCode,
  InternalServerError,
  JsonController,
  NotFoundError,
  Post,
} from "routing-controllers";
import { User } from "@data/entities/user/user.entity";
import { EntityAlreadyExistsError } from "@services/common/errors/entity-already-exists.error";
import { EntityNotFoundError } from "@services/common/errors/entity-not-found.error";
import { CreateJoinRequestService } from "@services/join-request/send-join-request.service";
import { SignUpsTimeEndedError } from "@services/join-request/errors/signs-ups-time-ended.error";
import { RequirementsNotSatisfiedError } from "@root/services/join-request/errors/requirements-not-satisfied.error";
import { ConflictError } from "../../http-errors/conflict.error";
import { SendJoinRequestDTO } from "./dtos/send-join-request.dto";
import { SendJoinRequestResponse } from "./responses/send-join-request.response";
import { mapJoinRequestToJoinRequestResponse } from "../../responses/entities/join-request.entity.response";
import { getErrorMessageOrCreateDefault } from "../../utils/error/get-message-or-create-default";

/**
 * Controller for POST /join-requests requests.
 * Creates a join request if sent body satisfies conditions set joinRequestService.
 * User has to be authenticated to use this route.
 */
@JsonController()
export class CreateRaidJoinRequestController {
  constructor(private readonly joinRequestService: CreateJoinRequestService) {}

  @HttpCode(201)
  @Post("/join-requests")
  async handleRequest(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: SendJoinRequestDTO
  ): Promise<SendJoinRequestResponse> {
    try {
      return await this.createJoinRequest(user, dto);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async createJoinRequest(user: User, dto: SendJoinRequestDTO) {
    const joinRequest = await this.joinRequestService.create({
      userId: user.id,
      postId: dto.postId,
      roleId: dto.roleId,
    });

    return { data: mapJoinRequestToJoinRequestResponse(joinRequest) };
  }

  private mapError(error: any) {
    const message = getErrorMessageOrCreateDefault(error);

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundError(message);
    } else if (error instanceof EntityAlreadyExistsError) {
      throw new ConflictError(message);
    } else if (error instanceof RequirementsNotSatisfiedError) {
      throw new ForbiddenError();
    } else if (error instanceof SignUpsTimeEndedError) {
      throw new BadRequestError(message);
    } else {
      throw new InternalServerError(message);
    }
  }
}
