import { HttpError } from "routing-controllers";

export class UnprocessableEntityError extends HttpError {
  constructor(public readonly message: string) {
    super(422);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }

  toJSON() {
    return {
      status: this.httpCode,
      message: this.message,
    };
  }
}
