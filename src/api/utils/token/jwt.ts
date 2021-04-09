import * as jwt from "jsonwebtoken";
import { config } from "../../../config";

export class Jwt {
  constructor(public readonly id: number, private readonly exp: number) {}

  hasExpired() {
    return Date.now() >= this.exp * 1000;
  }

  /**
   * Decodes jwt string into data
   */
  static fromString(token: string) {
    const decoded = jwt.decode(token) as {
      id: number;
      iat: number;
      exp: number;
    };
    return new Jwt(decoded.id, decoded.exp);
  }
}

/**
 * Turns numeric id into associated json web token.
 */
export function createToken(id: number) {
  const token = jwt.sign(
    { id },
    config.server.jwt.secret,
    config.server.jwt.options
  );

  return token;
}
