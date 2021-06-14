import { InvalidPropertyError } from "../../common/errors/invalid-property.error";

export class RevertStatusToPendingError extends InvalidPropertyError {
  constructor() {
    super("status", "Cannot revert request status to pending");
  }
}
