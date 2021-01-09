import { JoinRequestStatus } from "@data/entities/join-request/join-request.status";

export interface UpdateJoinRequestDTO {
  status: JoinRequestStatus;
}
