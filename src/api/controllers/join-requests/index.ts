import { FindJoinRequestsController } from "./find-join-requests.controller";
import { FindJoinRequestController } from "./find-join-request.controller";
import { SendRaidJoinRequestController } from "./send-join-request.controller";
import { UpdateJoinRequestController } from "./update-join-request.controller";

// Available join-requests controllers
export const joinRequestsControllers = [
  FindJoinRequestsController,
  FindJoinRequestController,
  SendRaidJoinRequestController,
  UpdateJoinRequestController,
];
