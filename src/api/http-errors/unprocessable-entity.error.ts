import { HttpError } from "routing-controllers";

export class UnprocessableEntityError extends HttpError {
  private static statusCode = 422;

  constructor(public readonly message: string) {
    super(UnprocessableEntityError.statusCode);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }

  toJSON() {
    return {
      status: this.httpCode,
      message: this.message,
    };
  }
}
