import { FindJoinRequestsController } from "./find-join-requests.controller";
import { FindJoinRequestController } from "./find-join-request.controller";
import { CreateRaidJoinRequestController } from "./send-join-request.controller";
import { UpdateJoinRequestController } from "./update-join-request.controller";
import { DeleteJoinRequestController } from "./delete-join-request.controllers";

// Available join-requests controllers
export const joinRequestsControllers = [
  FindJoinRequestsController,
  FindJoinRequestController,
  CreateRaidJoinRequestController,
  UpdateJoinRequestController,
  DeleteJoinRequestController,
];
