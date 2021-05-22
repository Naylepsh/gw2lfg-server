import { FindJoinRequestsService } from "./find-join-requests.service";
import { FindJoinRequestService } from "./find-join-request.service";
import { CreateJoinRequestService } from "./create-join-request.service";
import { UpdateJoinRequestStatusService } from "./update-join-request-status.service";
import { CheckJoinRequestStatusChangePermissionService } from "./check-join-request-status-change-permission.service";
import { CheckJoinRequestDeletionPermissionService } from "./check-join-request-deletion-permission.service";
import { DeleteJoinRequestService } from "./delete-join-request.service";

// Available join requests services
export default {
  FindJoinRequestService,
  FindJoinRequestsService,
  CreateJoinRequestService,
  UpdateJoinRequestStatusService,
  CheckJoinRequestStatusChangePermissionService,
  CheckJoinRequestDeletionPermissionService,
  DeleteJoinRequestService,
};
