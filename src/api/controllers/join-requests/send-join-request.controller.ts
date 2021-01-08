import {
  Body,
  CurrentUser,
  ForbiddenError,
  HttpCode,
  InternalServerError,
  JsonController,
  NotFoundError,
  Post,
} from "routing-controllers";
import { User } from "@root/data/entities/user/user.entity";
import { EntityAlreadyExistsError } from "@root/services/common/errors/entity-already-exists.error";
import { EntityNotFoundError } from "@root/services/common/errors/entity-not-found.error";
import { SendJoinRequestService } from "@root/services/join-request/send-join-request.service";
import { RequirementsNotSatisfiedError } from "@root/services/join-request/errors/requirements-not-satisfied.error";
import { UnprocessableEntityError } from "../../http-errors/unprocessable-entity.error";
import { SendJoinRequestDTO } from "./dtos/send-join-request.dto";
import { SendJoinRequestResponse } from "./responses/send-join-request.response";

/*
Controller for POST /join-requests requests.
Creates a join request if sent body satisfies conditions set joinRequestService.
User has to be authenticated to use this route.
*/
@JsonController()
export class SendRaidJoinRequestController {
  constructor(private readonly joinRequestService: SendJoinRequestService) {}

  @HttpCode(201)
  @Post("/join-requests")
  async sendJoinRequest(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: SendJoinRequestDTO
  ): Promise<SendJoinRequestResponse> {
    try {
      const joinRequest = await this.joinRequestService.sendJoinRequest({
        userId: user.id,
        postId: dto.postId,
        roleId: dto.roleId,
      });

      return { data: joinRequest };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundError(e.message);
      } else if (e instanceof EntityAlreadyExistsError) {
        throw new UnprocessableEntityError(e.message);
      } else if (e instanceof RequirementsNotSatisfiedError) {
        throw new ForbiddenError();
      } else {
        throw new InternalServerError(e.message);
      }
    }
  }
}
