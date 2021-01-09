import { JoinRequestStatus } from "@data/entities/join-request/join-request.status";

export interface UpdateJoinRequestStatusDTO {
  id: number;
  newStatus: JoinRequestStatus;
}
