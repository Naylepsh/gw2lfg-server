export class InvalidPropertyError extends Error {
  constructor(public readonly property: string, message: string) {
    super(message);
  }
}

export class PastDateError extends InvalidPropertyError {
  constructor(property: string) {
    super(property, `property ${property} cannot be a past date`);
  }
}
