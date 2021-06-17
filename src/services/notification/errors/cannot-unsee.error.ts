export class CannotUnseeNotificationError extends Error {
  constructor(message: string = "Cannot unsee a notification") {
    super(message);
  }
}
