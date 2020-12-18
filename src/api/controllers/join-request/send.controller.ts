import {
  Body,
  CurrentUser,
  ForbiddenError,
  HttpCode,
  InternalServerError,
  JsonController,
  NotFoundError,
  Param,
  Post,
} from "routing-controllers";
import { User } from "@data/entities/user.entity";
import { EntityAlreadyExistsError } from "@services/errors/entity-already-exists.error";
import { PostNotFoundError } from "@services/errors/entity-not-found.error";
import {
  RequirementsNotSatisfiedError,
  SendJoinRequestService,
} from "@services/join-request/send.service";
import { UnprocessableEntityError } from "../../http-errors/unprocessable-entity.error";

class SendJoinRequestDTO {
  roleId: number;
}

@JsonController()
export class SendRaidJoinRequestController {
  constructor(private readonly joinRequestService: SendJoinRequestService) {}

  @HttpCode(201)
  @Post("/raid-posts/:id/join-request")
  async sendJoinRequest(
    @CurrentUser({ required: true }) user: User,
    @Param("id") postId: number,
    @Body({ validate: false }) dto: SendJoinRequestDTO
  ) {
    try {
      return await this.joinRequestService.sendJoinRequest({
        userId: user.id,
        postId,
        roleId: dto.roleId,
      });
    } catch (e) {
      if (e instanceof PostNotFoundError) {
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
