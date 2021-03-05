import { HttpError } from "routing-controllers";

/**
 * Custom 409 Conflict error since routing-controllers were lacking it.
 */
export class ConflictError extends HttpError {
  private static statusCode = 409;

  constructor(public readonly message: string) {
    super(ConflictError.statusCode, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  toJSON() {
    return {
      name: "ConflictError",
      message: this.message,
    };
  }
}
