export class CannotUnseeNotificationError extends Error {
  constructor(message: string = "Cannot unsee notification") {
    super(message);
  }
}
