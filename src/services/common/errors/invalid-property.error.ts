export class InvalidPropertyError extends Error {
  constructor(public readonly property: string, message: string) {
    super(message);
  }
}
