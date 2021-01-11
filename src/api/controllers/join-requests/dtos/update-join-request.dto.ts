import { JoinRequestStatus } from "@data/entities/join-request/join-request.status";
import { IsValidJoinRequestStatus } from "../validators/join-request-status.validator";

export class UpdateJoinRequestDTO {
  @IsValidJoinRequestStatus()
  status: JoinRequestStatus;
}
