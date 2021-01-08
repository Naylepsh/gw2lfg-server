import { FindJoinRequestsController } from "./find-join-requests.controller";
import { SendRaidJoinRequestController } from "./send-join-request.controller";

// Available join-requests controllers
export const joinRequestsControllers = [
  FindJoinRequestsController,
  SendRaidJoinRequestController,
];
