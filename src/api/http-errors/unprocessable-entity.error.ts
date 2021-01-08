import { HttpError } from "routing-controllers";

/*
Custom 422 Unprocessable Entity error since routing-controllers were lacking it.
*/
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
