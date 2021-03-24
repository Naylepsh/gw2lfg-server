export class SignUpsTimeEndedError extends Error {
  constructor() {
    super("Could not sign up. Sign up time exceeded.");
  }
}
